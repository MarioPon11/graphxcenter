import { createTRPCRouter } from "@/server/api/trpc";
import { accountsRouter } from "./accounts";
import { sessionRouter } from "./session";

export const authRouter = createTRPCRouter({
  accounts: accountsRouter,
  session: sessionRouter,
});
