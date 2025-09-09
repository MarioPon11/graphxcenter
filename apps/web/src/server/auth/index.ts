import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  twoFactor,
  username,
  magicLink,
  emailOTP,
  admin,
  apiKey,
  multiSession,
  openAPI,
} from "better-auth/plugins";
import { Profanity } from "@2toad/profanity";

import { env } from "@/env/server";
import { db, schema } from "@/server/db";
import { APP_NAME } from "@/constants";
import { getRedis } from "@/server/cache";
import { hashBuffer, generateId } from "@/lib/id";
import {
  SHORT_LIVED_TOKEN,
  LONG_LIVED_TOKEN,
  FRESH_TOKEN,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  API_KEY_LENGTH,
  API_KEY_MAX_NAME_LENGTH,
  API_KEY_MIN_NAME_LENGTH,
} from "./config";
import {
  ac,
  adminRoles,
  superAdmin,
  admin as adminRole,
  developer,
  manager,
  user,
} from "./access/admin";

const profanity = new Profanity({ languages: ["en", "es"] });

export const auth = betterAuth({
  appName: APP_NAME,
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    camelCase: false,
    schema,
  }),
  secondaryStorage: {
    get: async (key) => {
      const redis = await getRedis();
      return redis.get(key);
    },
    set: async (key, value, ttl) => {
      const redis = await getRedis();
      if (typeof ttl !== "undefined") {
        return redis.set(key, value, {
          expiration: { type: "EX", value: ttl },
        });
      }
      return redis.set(key, value);
    },
    delete: async (key) => {
      const redis = await getRedis();
      await redis.del(key);
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
      beforeDelete: async ({ id }) => {
        console.log(id);
      },
      afterDelete: async ({ id }) => {
        console.log(id);
      },
      deleteTokenExpiresIn: SHORT_LIVED_TOKEN,
      sendDeleteAccountVerification: async ({ token, url, user }) => {
        console.log(token, url, user);
      },
    },
    additionalFields: {},
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
      allowUnlinkingAll: false,
      updateUserInfoOnLink: true,
      trustedProviders: ["google"],
    },
    encryptOAuthTokens: env.NODE_ENV === "production",
    updateAccountOnSignIn: true,
  },
  session: {
    expiresIn: LONG_LIVED_TOKEN,
    freshAge: FRESH_TOKEN,
    cookieCache: {
      enabled: true,
    },
    additionalFields: {},
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
    resetPasswordTokenExpiresIn: SHORT_LIVED_TOKEN,
    revokeSessionsOnPasswordReset: false,
    onPasswordReset: async ({ user }) => {
      console.log(user);
    },
    password: {
      hash: async (password) => {
        const hashedPassword = await hashBuffer.digest(password);
        return hashedPassword;
      },
      verify: async ({ password, hash }) => {
        const hashedPassword = await hashBuffer.digest(password);
        return hashedPassword === hash;
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendOnSignUp: true,
    expiresIn: SHORT_LIVED_TOKEN,
    onEmailVerification: async (data) => {
      console.log(data);
    },
    afterEmailVerification: async (data) => {
      console.log(data);
    },
  },
  verification: {
    disableCleanup: env.NODE_ENV !== "production",
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      disableSignUp: true,
    },
  },
  onAPIError: {
    errorURL: "/error",
    throw: false,
  },
  plugins: [
    nextCookies(),
    twoFactor({
      issuer: APP_NAME,
      backupCodeOptions: {
        amount: 10,
        length: 12,
        storeBackupCodes: env.NODE_ENV === "production" ? "encrypted" : "plain",
      },
      totpOptions: {
        digits: 6,
        period: 60,
      },
    }),
    username({
      minUsernameLength: MIN_USERNAME_LENGTH,
      maxUsernameLength: MAX_USERNAME_LENGTH,
      validationOrder: {
        username: "post-normalization",
        displayUsername: "post-normalization",
      },
      usernameNormalization: (username) => {
        return username.toLowerCase().replace(/[\s_]+/g, "-");
      },
      usernameValidator: async (username) => {
        const isValid =
          /^[a-zA-Z0-9-]+$/.test(username) && !profanity.exists(username);
        return isValid;
      },
      displayUsernameNormalization: (username) => {
        return username.toLowerCase().replace(/[\s_]+/g, "-");
      },
      displayUsernameValidator: async (username) => {
        const isValid =
          /^[a-zA-Z0-9-]+$/.test(username) && !profanity.exists(username);
        return isValid;
      },
    }),
    magicLink({
      disableSignUp: true,
      storeToken: env.NODE_ENV === "production" ? "hashed" : "plain",
      expiresIn: SHORT_LIVED_TOKEN,
      sendMagicLink: async ({ email, token, url }) => {
        console.log(email, token, url);
      },
    }),
    emailOTP({
      overrideDefaultEmailVerification: true,
      allowedAttempts: 6,
      expiresIn: SHORT_LIVED_TOKEN,
      otpLength: 6,
      storeOTP: env.NODE_ENV === "production" ? "hashed" : "plain",
      sendVerificationOnSignUp: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        console.log(email, otp, type);
      },
    }),
    apiKey({
      apiKeyHeaders: ["x-api-key"],
      customKeyGenerator: async ({ length, prefix }) => {
        return `${prefix}_${generateId(length)}`;
      },
      defaultKeyLength: API_KEY_LENGTH,
      defaultPrefix: "gxc",
      disableKeyHashing: env.NODE_ENV !== "production",
      enableMetadata: true,
      keyExpiration: {
        defaultExpiresIn: null,
        minExpiresIn: LONG_LIVED_TOKEN,
      },
      maximumNameLength: API_KEY_MAX_NAME_LENGTH,
      minimumNameLength: API_KEY_MIN_NAME_LENGTH,
      requireName: true,
    }),
    multiSession({
      maximumSessions: 5,
    }),
    openAPI(),
    admin({
      ac,
      roles: {
        superAdmin,
        admin: adminRole,
        developer,
        manager,
        user,
      },
      adminRoles,
      defaultRole: "user",
    }),
  ],
  telemetry: {
    enabled: false,
  },
});
