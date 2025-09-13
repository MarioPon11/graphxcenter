import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { adminRoles } from "@/server/auth/access/admin";
import { SignUpForm } from "./stepper";

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ step?: "1" | "2" | "3" | "4" }>;
}) {
  const { step } = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  /**
   *  Redirection logic for each step in case of success or failed validation
   *  if a value is null, the step will be rendered
   *  if a value is a string, the step will be redirected to the given path
   */
  const stepRedirects: {
    username: { true: string | null; false: string | null };
    accounts: { true: string | null; false: string | null };
    emailVerified: { true: string | null; false: string | null };
    twoFactor: { true: string | null; false: string | null };
  } = {
    username: { true: null, false: "/sign-up?step=1" },
    accounts: {
      true: null,
      false: "/sign-up?step=2",
    },
    emailVerified: {
      true: null,
      false: "/sign-up?step=3",
    },
    twoFactor: {
      true: null,
      false: "/sign-up?step=4",
    },
  };

  // Step 1: username present → pass; missing → stay
  const hasUsername = !!session.user?.username;
  if (!hasUsername) {
    const dest = stepRedirects.username.false;
    if (dest && !step) redirect(dest);
  } else if (stepRedirects.username.true) {
    redirect(stepRedirects.username.true);
  }

  // Step 2: multiple accounts (> 1) → pass; <= 1 → stay
  const hasMultipleAccounts = (accounts?.length ?? 0) > 1;
  if (!hasMultipleAccounts) {
    const dest = stepRedirects.accounts.false;
    if (dest && !step) redirect(dest);
  } else if (stepRedirects.accounts.true) {
    redirect(stepRedirects.accounts.true);
  }

  // Step 3: email verified → pass; not verified → stay
  const isEmailVerified = session.user.emailVerified === true;
  if (!isEmailVerified) {
    const dest = stepRedirects.emailVerified.false;
    if (dest && !step) redirect(dest);
  } else if (stepRedirects.emailVerified.true) {
    redirect(stepRedirects.emailVerified.true);
  }

  // Step 4 (nested): if admin role AND twoFactor disabled → stay; else pass
  const isAdminRole = adminRoles.includes(session.user.role ?? "");
  const isTwoFactorEnabled = !!session.user.twoFactorEnabled;
  const requiresTwoFactor = isAdminRole && !isTwoFactorEnabled;
  if (requiresTwoFactor) {
    const dest = stepRedirects.twoFactor.false;
    if (dest && !step) redirect(dest);
  } else if (stepRedirects.twoFactor.true) {
    redirect(stepRedirects.twoFactor.true);
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
