"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FieldGroup } from "@repo/ui/components/field";
import {
  FormInput,
  FormPassword,
  FormCheckbox,
} from "@repo/ui/components/form";
import { SocialButtons } from "@/components/auth/social-buttons";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/server/auth/config";
import { Separator } from "@repo/ui/components/separator";
import { Toaster } from "@repo/ui/components/sonner";

const formSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .refine((val) => val.endsWith("@graphxsource"), {
      message: "Only graphxsource email addresses are allowed",
    }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`,
    }),
  rememberMe: z.boolean().default(false),
});
type FormData = z.infer<typeof formSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    reValidateMode: "onSubmit",
    mode: "onSubmit",
  });

  async function onSubmit(data: FormData) {}

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
      id="sign-in-form"
      {...props}
    >
      <FieldGroup className="gap-2">
        <SocialButtons provider="google" />
        <SocialButtons provider="github" />
      </FieldGroup>
      <div className="flex w-full items-center gap-4">
        <Separator className="flex-1" />
        <p className="text-muted-foreground text-sm">or continue with</p>
        <Separator className="flex-1" />
      </div>
      <FieldGroup className="mb-4 gap-2">
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="john.doe@example.com"
        />
        <FormPassword
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your password"
        />
        <div className="flex items-center gap-2">
          <FormCheckbox
            control={form.control}
            name="rememberMe"
            label="Remember me"
          />
          <Link
            href="/forgot-password"
            className="text-sm whitespace-nowrap text-blue-400 underline underline-offset-4 visited:text-blue-500 hover:no-underline"
          >
            Forgot password?
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
