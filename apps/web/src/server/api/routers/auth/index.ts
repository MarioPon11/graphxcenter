import { createTRPCRouter } from "@/server/api/trpc";
import { accountsRouter } from "./accounts";

export const authRouter = createTRPCRouter({
  accounts: accountsRouter,
});
