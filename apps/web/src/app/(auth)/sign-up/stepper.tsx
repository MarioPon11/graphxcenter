"use client";

import React from "react";
import type { User } from "better-auth";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@repo/ui/components/stepper";
import { cn } from "@repo/ui/lib/utils";
import { useQueryState } from "@repo/ui/components/nuqs";

import { ProfileForm } from "./profile-form";
import { AccountsForm } from "./accounts-form";
import { TwoFactorForm } from "./two-factor-form";
import { Success } from "./success";

type SignUpFormProps = React.ComponentProps<"div"> & {
  steps: number[];
  user: User;
};

export function SignUpForm({
  steps,
  user,
  className,
  ...props
}: SignUpFormProps) {
  const [step, setStep] = useQueryState("step");

  return (
    <div className={cn("w-full max-w-xl", className)} {...props}>
      <div className="mx-auto space-y-8 text-center">
        <Stepper
          value={Number(step)}
          onValueChange={(value) => setStep(value.toString())}
        >
          {steps.map((step) => (
            <StepperItem key={step} step={step} className="not-last:flex-1">
              <StepperTrigger asChild>
                <StepperIndicator />
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
        {Number(step) === 1 && <ProfileForm user={user} />}
        {Number(step) === 2 && <AccountsForm />}
        {Number(step) === 3 && steps.includes(4) && <TwoFactorForm />}
        {Number(step) === 3 && !steps.includes(4) && <Success />}
        {Number(step) === 4 && <Success />}
      </div>
    </div>
  );
}
