import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { adminRoles } from "@/server/auth/access/admin";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    if (adminRoles.includes(session.user.role ?? "")) {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  } else {
    redirect("/sign-in");
  }
}
