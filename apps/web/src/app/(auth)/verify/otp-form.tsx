"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/input-otp";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { verifyEmail } from "@/hooks/auth";
import { OTP_LENGTH } from "@/server/auth/config";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { cn } from "@repo/ui/lib/utils";

import { Logo } from "@/components/icons";
import { APP_NAME } from "@/constants";

const formSchema = z.object({
  otp: z.string().min(6),
  email: z.email(),
});

export function OtpForm() {
  const searchParams = useSearchParams();
  const otpValue = searchParams.get("otp") ?? "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: otpValue,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await verifyEmail({ query: { token: values.otp } });
    if (res.error) {
      console.log("Error verifying email", res.error);
    }
  }

  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6")}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Logo className="size-8" />
              </div>
              <span className="sr-only">{APP_NAME}</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to {APP_NAME}</h1>
            <div className="text-center text-sm">
              Use your graphxsource email to sign in.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={OTP_LENGTH}
                    {...field}
                    containerClassName="w-full"
                  >
                    <InputOTPGroup className="w-full">
                      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex max-w-full gap-2">
            <Button type="submit" className="w-full">
              Verify
            </Button>
            <Button variant="outline" className="w-full">
              Resend
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
