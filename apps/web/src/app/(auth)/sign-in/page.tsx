import React from "react";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./sign-up-form";
import { PasswordForm } from "./password-form";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ step?: "sign-in" | "sign-up" }>;
}) {
  const { step } = await searchParams;
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        {step === "sign-up" ? (
          <SignUpForm />
        ) : step === "sign-in" ? (
          <PasswordForm />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
