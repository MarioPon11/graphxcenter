"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { User } from "better-auth";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@repo/ui/components/stepper";
import { cn } from "@repo/ui/lib/utils";
import { ProfileForm } from "./profile-form";
import { AccountsForm } from "./accounts-form";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const step = Number(searchParams.get("step") ?? "1") ?? 1;
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    setCurrentStep(Number(value ?? "1"));

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url);
  }

  function handleNext() {
    setParam("step", (currentStep + 1).toString());
  }

  return (
    <div className={cn("w-full max-w-xl", className)} {...props}>
      <div className="mx-auto space-y-8 text-center">
        <Stepper
          value={currentStep}
          onValueChange={(value) => setParam("step", value.toString())}
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
        {currentStep === 1 && (
          <ProfileForm handleNext={handleNext} user={user} />
        )}
        {currentStep === 2 && <AccountsForm />}
      </div>
    </div>
  );
}
