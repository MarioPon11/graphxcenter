import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    CACHE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
    AZ_CONNECTION_STRING: z.string(),
    AZ_IMAGES_CONTAINER: z.string(),
    AZ_CUSTOM_DOMAIN: z.string(),
  },
  experimental__runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_VALIDATION,
});
