import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const accountsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await ctx.auth.listUserAccounts({
      headers: ctx.headers,
    });

    return accounts;
  }),
  link: protectedProcedure
    .input(
      z.object({
        provider: z.enum(["google"]),
        callbackURL: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.auth.linkSocialAccount({
        headers: ctx.headers,
        body: {
          ...input,
        },
      });

      return account;
    }),
  unlink: protectedProcedure
    .input(
      z.object({
        providerId: z.string(),
        accountId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.auth.unlinkAccount({
        headers: ctx.headers,
        body: {
          ...input,
        },
      });

      return account;
    }),
});
