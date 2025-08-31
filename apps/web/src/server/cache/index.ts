import { createClient, type RedisClientType } from "redis";
import { env } from "@/env/server";

declare global {
  var __redisClient__: RedisClientType | undefined;
}

let client: RedisClientType;

if (!global.__redisClient__) {
  client = createClient({
    url: env.CACHE_URL,
    // socket: { keepAlive: 5000, reconnectStrategy: (retries) => Math.min(retries * 50, 1000) },
  });

  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  global.__redisClient__ = client;
} else {
  client = global.__redisClient__;
}

export async function getRedis(): Promise<RedisClientType> {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

export async function closeRedis() {
  if (client?.isOpen) {
    await client.quit(); // or client.disconnect() if you don't want to wait for replies
  }
}
