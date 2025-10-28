import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  twoFactor,
  magicLink,
  phoneNumber,
  admin,
  apiKey,
  organization,
  lastLoginMethod,
  multiSession,
  openAPI,
} from "better-auth/plugins";

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
  API_KEY_LENGTH,
  API_KEY_MAX_NAME_LENGTH,
  API_KEY_MIN_NAME_LENGTH,
  OTP_LENGTH,
} from "./config";
import {
  ac,
  adminRoles,
  superAdmin,
  admin as adminRole,
  superUser,
  user,
} from "./access/admin";
import { organizationAccessControl } from "./access/organization";

/* TODO: Add actual email sending logic*/
export const auth = betterAuth({
  appName: APP_NAME.join(""),
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
        /* TODO: Add actual email sending logic*/
        console.log(id);
      },
      deleteTokenExpiresIn: SHORT_LIVED_TOKEN,
      sendDeleteAccountVerification: async ({ token, url, user }) => {
        /* TODO: Add actual email sending logic*/
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
    disableSignUp: false,
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
      issuer: APP_NAME.join(""),
      backupCodeOptions: {
        amount: 10,
        length: 12,
        storeBackupCodes: env.NODE_ENV === "production" ? "encrypted" : "plain",
      },
      totpOptions: {
        digits: 6,
        period: 60,
      },
      otpOptions: {
        allowedAttempts: 6,
        digits: OTP_LENGTH,
        period: SHORT_LIVED_TOKEN,
        sendOTP: async ({ otp, user }) => {
          /* TODO: Add actual email sending logic*/
          console.log(otp, user);
        },
      },
    }),
    magicLink({
      disableSignUp: true,
      storeToken: env.NODE_ENV === "production" ? "hashed" : "plain",
      expiresIn: SHORT_LIVED_TOKEN,
      sendMagicLink: async ({ email, token, url }) => {
        /* TODO: Add actual email sending logic*/
        console.log(email, token, url);
      },
    }),
    phoneNumber({
      sendOTP: async ({ code, phoneNumber }) => {
        /* TODO: Add actual phone number verification logic */
        console.log(code, phoneNumber);
      },
      requireVerification: false,
      otpLength: OTP_LENGTH,
      expiresIn: SHORT_LIVED_TOKEN,
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
    organization({
      ac: organizationAccessControl,
      allowUserToCreateOrganization: async (user) => {
        const role = user.role;

        if (adminRoles.includes(role ?? "")) {
          return true;
        }

        return user.role === "superUser";
      },
      cancelPendingInvitationsOnReInvite: true,
      dynamicAccessControl: {
        enabled: true,
      },
      membershipLimit: 700,
      invitationLimit: 1000,
      organizationLimit: () => {
        return false;
      },
      teams: {
        enabled: true,
        allowRemovingAllTeams: false,
        defaultTeam: {
          enabled: true,
          customCreateDefaultTeam: async (organization) => {
            return {
              id: generateId(16),
              name: "Default Team",
              organizationId: organization.id,
              createdAt: new Date(),
            };
          },
        },
      },
      invitationExpiresIn: LONG_LIVED_TOKEN,
      sendInvitationEmail: async ({
        email,
        id,
        invitation,
        inviter,
        organization,
        role,
      }) => {
        /* TODO: Add actual email sending logic*/
        console.log(email, id, invitation, inviter, organization, role);
      },
    }),
    multiSession({
      maximumSessions: 5,
    }),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    openAPI(),
    admin({
      ac,
      roles: {
        superAdmin,
        admin: adminRole,
        superUser,
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
