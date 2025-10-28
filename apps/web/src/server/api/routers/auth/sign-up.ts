import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const signUpRouter = createTRPCRouter({
  checkEmail: publicProcedure
    .input(
      z.object({
        email: z
          .email()
          .refine(
            (val) =>
              val.endsWith("@graphxsource.com") ||
              val.endsWith("@graphxsource.hn"),
            {
              message: "Only graphxsource email addresses are allowed",
            },
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email is already in use",
        });
      }

      return true;
    }),
});
