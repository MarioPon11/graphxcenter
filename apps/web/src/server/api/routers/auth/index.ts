import { createTRPCRouter } from "@/server/api/trpc";
import { accountsRouter } from "./accounts";
import { sessionRouter } from "./session";
import { signUpRouter } from "./sign-up";

export const authRouter = createTRPCRouter({
  accounts: accountsRouter,
  session: sessionRouter,
  signUp: signUpRouter,
});
