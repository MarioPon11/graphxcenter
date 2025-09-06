import { createTRPCRouter } from "@/server/api/trpc";
import { usersRouter } from "./users";
import { bansRouter } from "./bans";
import { accountsRouter } from "./accounts";

export const adminRouter = createTRPCRouter({
  users: usersRouter,
  bans: bansRouter,
  accounts: accountsRouter,
});
