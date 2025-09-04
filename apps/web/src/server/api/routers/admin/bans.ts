import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import z from "zod";

export const bansRouter = createTRPCRouter({
  make: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        banReason: z.string().optional(),
        banExpires: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.auth.banUser({
        headers: ctx.headers,
        body: {
          ...input,
        },
      });

      return user;
    }),
  remove: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.auth.unbanUser({
        headers: ctx.headers,
        body: {
          ...input,
        },
      });

      return user;
    }),
});
