import React from "react";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./sign-up-form";
import { PasswordForm } from "./password-form";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ "sign-up"?: string; "sign-in"?: string }>;
}) {
  const { "sign-up": signUp, "sign-in": signIn } = await searchParams;
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        {signUp ? <SignUpForm /> : signIn ? <PasswordForm /> : <LoginForm />}
      </div>
    </div>
  );
}
