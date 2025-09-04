import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from "zod";
import { eq } from "drizzle-orm";
import { roomRules, rooms } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const roomsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const rooms = await ctx.db.query.rooms.findMany({
      with: {
        roomRules: true,
      },
    });

    return rooms;
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.query.rooms.findFirst({
        where: eq(rooms.id, input.id),
      });

      return room;
    }),
  create: protectedProcedure
    .input(
      z.object({
        room: z.object({
          name: z.string(),
          capacity: z.number(),
          description: z.string().optional(),
        }),
        rules: z
          .array(
            z.object({
              startTime: z.date(),
              endTime: z.date(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hasPermission = await ctx.auth.userHasPermission({
        headers: ctx.headers,
        body: {
          permissions: {
            rooms: ["create"],
          },
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create a room",
          cause: { hasPermission, data: "From create room" },
        });
      }

      const newRoom = await ctx.db.transaction(async (tx) => {
        const room = await tx
          .insert(rooms)
          .values({
            ...input.room,
            createdBy: ctx.session.user.id,
            updatedBy: ctx.session.user.id,
          })
          .returning()
          .then(([r]) => r);

        if (!room) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create room",
            cause: { room, data: "From create room" },
          });
        }

        const rules = await tx
          .insert(roomRules)
          .values(
            input.rules.map((rule) => ({
              ...rule,
              roomId: room.id,
              createdBy: ctx.session.user.id,
              updatedBy: ctx.session.user.id,
            })),
          )
          .returning()
          .then(([r]) => r);

        if (!rules) {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create room rules",
            cause: { rules, data: "From create room" },
          });
        }

        return { room, rules };
      });

      return newRoom;
    }),
});
