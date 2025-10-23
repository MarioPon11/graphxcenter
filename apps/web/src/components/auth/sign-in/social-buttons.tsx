"use client";

import React from "react";
import { ActionButton } from "@repo/ui/components/action-button";
import { Google, GitHub } from "@repo/icons";
import { cn } from "@repo/ui/lib/utils";
import { signIn } from "@/hooks/auth";

type SocialProvider = "google" | "github";

type SocialButtonProps = Omit<
  React.ComponentProps<typeof ActionButton>,
  "children" | "onClick" | "size" | "action"
> & {
  provider: SocialProvider;
  size?: "sm" | "lg" | "default";
};

export function SocialButton({
  provider,
  size = "default",
  variant = "outline",
  className,
  ...props
}: SocialButtonProps) {
  return (
    <ActionButton
      type="button"
      id={`sign-in-${provider}`}
      variant={variant}
      size={size}
      action={async () => {
        const result = await signIn.social({ provider });
        if (result.error) {
          return { error: true, message: result.error.message };
        }
        return { error: false };
      }}
      {...props}
    >
      {provider === "google" ? <Google /> : <GitHub />}
      <span>Continue with {provider}</span>
    </ActionButton>
  );
}

export function SocialButtons({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex w-full flex-col gap-3", className)} {...props}>
      <SocialButton provider="google" />
      <SocialButton provider="github" />
    </div>
  );
}
