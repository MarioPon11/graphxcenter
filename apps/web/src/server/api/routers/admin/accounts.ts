import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { accounts as accountsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export const accountsRouter = createTRPCRouter({
  list: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const accounts = await ctx.db.query.accounts.findMany({
        where: eq(accountsTable.userId, input.userId),
      });

      return accounts;
    }),
});
