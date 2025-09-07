import "server-only";

import Transport from "winston-transport";
import postgres, { type Sql, type JSONValue } from "postgres";
import winston from "winston";
import { env } from "@/env/server";
import type { LogData } from "@/server/db/schema/logs";

export type PostgresTransportOptions = Transport.TransportStreamOptions & {
  // connection
  connectionString: string;
  // performance
  batchSize?: number; // e.g., 50
  flushIntervalMs?: number; // e.g., 1000
  // resilience
  maxQueueSize?: number; // e.g., 5000
  // target
  schema?: string; // default 'logs'
  table?: string; // default 'logs'
  // mapping
  mapLevel?: (level: string) => "info" | "warning" | "error";
  // optional external connection (reuse)
  sql?: Sql;
};

type Row = {
  level: "info" | "warning" | "error";
  message: string;
  metadata: JSONValue;
  created_at: Date;
};

function defaultMapLevel(level: string): Row["level"] {
  const l = level.toLowerCase();
  if (l === "warn" || l === "warning") return "warning";
  if (l === "error") return "error";
  return "info";
}

// Safely normalize metadata to an array of JSON-serializable objects
function extractMetadata(info: any): JSONValue {
  // Winston keeps message and level, everything else is "meta"
  const { level, message, ...rest } = info || {};
  // Some formats put a 'stack' or Error objects; convert to plain
  const replacer = (_k: string, v: any) => {
    if (v instanceof Error) {
      return {
        name: v.name,
        message: v.message,
        stack: v.stack,
      };
    }
    return v;
  };
  try {
    // Force JSON round-trip to ensure serializable content
    return JSON.parse(JSON.stringify([rest], replacer)) as JSONValue;
  } catch {
    return [String(rest)] as JSONValue;
  }
}

export class PostgresTransport extends Transport {
  private options: {
    connectionString: string;
    batchSize: number;
    flushIntervalMs: number;
    maxQueueSize: number;
    schema: string;
    table: string;
    mapLevel: NonNullable<PostgresTransportOptions["mapLevel"]>;
  };
  private sql: Sql;
  private ownSql: boolean;
  private queue: Row[] = [];
  private timer?: NodeJS.Timeout;
  private flushing = false;

  constructor(opts: PostgresTransportOptions) {
    super(opts);

    this.options = {
      connectionString: opts.connectionString,
      batchSize: opts.batchSize ?? 50,
      flushIntervalMs: opts.flushIntervalMs ?? 1000,
      maxQueueSize: opts.maxQueueSize ?? 5000,
      schema: opts.schema ?? "logs",
      table: opts.table ?? "logs",
      mapLevel: opts.mapLevel ?? defaultMapLevel,
    };

    if (opts.sql) {
      this.sql = opts.sql;
      this.ownSql = false;
    } else {
      this.sql = postgres(this.options.connectionString);
      this.ownSql = true;
    }

    this.startTimer();
  }

  log(info: any, callback: () => void) {
    setImmediate(() => this.emit("logged", info));
    const row: Row = {
      level: this.options.mapLevel(info.level),
      message: String(info.message ?? ""),
      metadata: extractMetadata(info),
      created_at: new Date(),
    };

    if (this.queue.length >= this.options.maxQueueSize) {
      // Drop oldest to avoid unbounded memory growth
      this.queue.shift();
      this.emit(
        "warn",
        new Error("PostgresTransport queue overflow; dropping oldest log"),
      );
    }
    this.queue.push(row);

    if (this.queue.length >= this.options.batchSize) {
      void this.flush();
    }

    callback();
  }

  private startTimer() {
    this.timer = setInterval(() => {
      void this.flush();
    }, this.options.flushIntervalMs);
    // Keep process alive? No: allow clean shutdowns
    if (this.timer && typeof this.timer.unref === "function") {
      this.timer.unref();
    }
  }

  private async flush() {
    if (this.flushing) return;
    if (this.queue.length === 0) return;
    this.flushing = true;

    const toInsert = this.queue.splice(0, this.options.batchSize);
    const { schema, table } = this.options;

    try {
      // Using a single multi-row insert
      // Note: postgres tagged template helps parameterization
      await this.sql.begin(async (tx) => {
        await tx`
          insert into ${tx(schema)}.${tx(table)} ${tx(
            toInsert.map((r) => ({
              level: r.level,
              message: r.message,
              metadata: tx.json(r.metadata),
              created_at: r.created_at,
            })),
            "level",
            "message",
            "metadata",
            "created_at",
          )}
        `;
      });
    } catch (err) {
      // Put rows back to the front (best effort) to retry next flush
      this.queue = toInsert.concat(this.queue);
      this.emit("error", err as Error);
    } finally {
      this.flushing = false;
    }
  }

  // Allow manual drain on shutdown
  async close(): Promise<void> {
    if (this.timer) clearInterval(this.timer);
    await this.flush();
    if (this.ownSql) {
      await this.sql.end({ timeout: 5 });
    }
  }
}

const baseLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new PostgresTransport({
      connectionString: env.DATABASE_URL,
      batchSize: 50,
      flushIntervalMs: 1000,
      maxQueueSize: 5000,
      mapLevel: (lvl) => defaultMapLevel(lvl),
    }),
  ],
});

type Level = "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";

interface TypeLogger {
  error(message: string, ...meta: LogData[]): winston.Logger;
  warn(message: string, ...meta: LogData[]): winston.Logger;
  info(message: string, ...meta: LogData[]): winston.Logger;
  debug(message: string, ...meta: LogData[]): winston.Logger;
  // generic log method
  log(level: Level, message: string, ...meta: LogData[]): winston.Logger;
}

export const logger: TypeLogger = baseLogger as TypeLogger;
