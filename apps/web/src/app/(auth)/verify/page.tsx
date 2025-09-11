import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/server/auth";
import { OtpForm } from "./otp-form";
import { TwoFactorForm } from "./two-factor-form";

export default async function Verify({
  searchParams,
}: {
  searchParams: Promise<{
    verification?:
      | "sign-in"
      | "forget-password"
      | "email-verification"
      | "two-factor-otp"
      | "two-factor-totp";
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { verification } = await searchParams;

  if (verification === "two-factor-otp" || verification === "two-factor-totp") {
    if (!session) {
      redirect("/sign-in");
    }
    if (!session.user.twoFactorEnabled) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="flex h-dvh w-dvw items-center justify-center">
      {verification === "two-factor-otp" ||
      verification === "two-factor-totp" ? (
        <TwoFactorForm />
      ) : (
        <OtpForm />
      )}
    </main>
  );
}
