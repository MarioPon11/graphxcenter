import {
  pgSchema,
  serial,
  text,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";
import type { UserWithRole } from "better-auth/plugins/admin";
import type { rooms } from "./rooms";
import type { events } from "./events";

export const logSchema = pgSchema("logs");

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type LogData =
  | Prettify<{ logType: "user" } & UserWithRole>
  | Prettify<{ logType: "room" } & typeof rooms.$inferSelect>
  | Prettify<{ logType: "event" } & typeof events.$inferSelect>
  | Prettify<{ logType: string } & Record<string, unknown>>;

export const logs = logSchema.table("logs", {
  id: serial("id").primaryKey(),
  level: varchar("level", {
    enum: ["info", "warning", "error"],
  }).notNull(),
  message: text("message").notNull(),
  data: jsonb("metadata").default([]).$type<LogData[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
