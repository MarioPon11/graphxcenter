import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/server/auth/config";

export const usersRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        sortDirection: z.enum(["asc", "desc"]).default("asc"),
        sortField: z.enum(["name", "email"]),
        searchField: z.enum(["name", "email"]),
        searchValue: z.string(),
        searchOperator: z.enum(["contains", "starts_with", "ends_with"]),
        sortBy: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.auth.listUsers({
        headers: ctx.headers,
        query: {
          ...input,
        },
      });

      return users;
    }),
  get: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        withAccounts: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.userId),
        with: {
          accounts: input.withAccounts ? true : undefined,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
          cause: { user, data: "From get user" },
        });
      }

      return user;
    }),
  create: adminProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string(),
        name: z.string(),
        role: z.enum(["superAdmin", "admin", "developer", "user", "manager"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.auth.createUser({
        headers: ctx.headers,
        body: {
          ...input,
        },
      });

      return user;
    }),
  changeRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["superAdmin", "admin", "developer", "user", "manager"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.auth.setRole({
        headers: ctx.headers,
        body: {
          ...input,
        },
      });

      return user;
    }),
  update: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        data: z.object({
          name: z.string().optional(),
          email: z.email().optional(),
          username: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.auth.adminUpdateUser({
        headers: ctx.headers,
        body: {
          ...input,
        },
      });

      return user;
    }),

  setPassword: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        newPassword: z
          .string()
          .min(MIN_PASSWORD_LENGTH)
          .max(MAX_PASSWORD_LENGTH),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.auth.setUserPassword({
        headers: ctx.headers,
        body: {
          ...input,
        },
      });

      return user;
    }),
});
