"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@repo/ui/components/stepper";

import { Logo } from "@/components/icons";
import { APP_NAME } from "@/constants";
import { signUp } from "@/hooks/auth";
import { EmailForm } from "./email.form";
import { ProfileForm } from "./profile.form";
import { VerifyAccount } from "./verify-account";

const steps = [1, 2, 3, 4];

export function SignUpForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function signUpUser() {
    const res = await signUp.email({ email, name, password });
    if (res.error) {
      throw new Error(res.error.message);
    }
    return res.data;
  }

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <Link href="/" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <Logo className="size-8" />
          </div>
          <span className="sr-only">{APP_NAME}</span>
        </Link>
        <h1 className="text-xl font-bold">Welcome to {APP_NAME}</h1>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="underline underline-offset-4 hover:no-underline"
          >
            Sign in
          </Link>
        </div>
      </div>
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        {steps.map((step) => (
          <StepperItem key={step} step={step} className="not-last:flex-1">
            <StepperTrigger asChild>
              <StepperIndicator />
            </StepperTrigger>
            {step < steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>
      {currentStep === 1 && (
        <EmailForm
          onSubmit={async ({ email }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setEmail(email);
            console.log(email);
            setCurrentStep(2);
          }}
        />
      )}
      {currentStep === 2 && (
        <ProfileForm
          onSubmit={async ({ name: formName, password: formPassword }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setName(formName);
            setPassword(formPassword);
            toast.promise(signUpUser, {
              loading: "Creating account...",
              success: () => {
                setCurrentStep(3);
                return "Verification email sent";
              },
              error: "Failed to create account",
            });
          }}
          onBack={() => setCurrentStep(1)}
        />
      )}
      {currentStep === 3 && (
        <VerifyAccount
          onSubmit={async ({ email, name }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(email, name);
            setCurrentStep(4);
          }}
          values={{
            email: email,
            name: name,
          }}
        />
      )}
    </div>
  );
}
