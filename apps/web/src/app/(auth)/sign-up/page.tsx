import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { adminRoles } from "@/server/auth/access/admin";
import { SignUpForm } from "./stepper";

export default async function SignUp() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.username) {
    redirect("/dashboard");
  }

  const steps: number[] = adminRoles.includes(session.user.role ?? "")
    ? [1, 2, 3, 4]
    : [1, 2, 3];

  return (
    <main className="flex h-dvh w-dvw items-center justify-center">
      <SignUpForm steps={steps} user={session.user} />
    </main>
  );
}
