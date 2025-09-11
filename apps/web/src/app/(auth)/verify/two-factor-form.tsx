"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { cn } from "@repo/ui/lib/utils";

import { twoFactor } from "@/hooks/auth";
import { OTP_LENGTH } from "@/server/auth/config";
import { Logo } from "@/components/icons";
import { APP_NAME } from "@/constants";

const formSchema = z.object({
  otp: z
    .string()
    .min(OTP_LENGTH, { error: "OTP is required" })
    .max(OTP_LENGTH, { error: "OTP is required" }),
});

export function TwoFactorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const otpValue = searchParams.get("otp") ?? "";

  const verificationType: "two-factor-otp" | "two-factor-totp" =
    (searchParams.get("verification") as
      | "two-factor-otp"
      | "two-factor-totp"
      | null) ?? "two-factor-otp";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: otpValue,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await twoFactor.verifyOtp({
        code: values.otp,
      });

      if (res.error) {
        console.log("Error verifying OTP", res.error);
        form.setError("otp", {
          message: res.error.message ?? "Invalid OTP",
        });
        return;
      }

      toast.success("OTP verified successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Verification error:", error);
      form.setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }

  async function onResend() {
    const res = await twoFactor.sendOtp();

    if (res.error) {
      console.log("Error sending OTP", res.error);
      form.setError("root", {
        message: res.error.message ?? "Failed to send OTP",
      });
      return;
    }

    form.reset();
    toast.success("Verification email sent successfully!");
  }

  return (
    <Form {...form}>
      <div className={cn("relative mx-auto w-full max-w-sm")}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <Button
            variant="ghost"
            className="absolute top-0 left-0"
            type="button"
            onClick={() => router.back()}
          >
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
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
            <h1 className="text-xl font-bold">Verify your email</h1>
            <div className="text-center text-base">
              {verificationType === "two-factor-otp" ? (
                <p>Check your email for the verification token.</p>
              ) : (
                <p>Check your authenticator app for the verification token.</p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center gap-2">
                  <div className="grid gap-2">
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={OTP_LENGTH} {...field}>
                        <InputOTPGroup>
                          {Array.from({ length: OTP_LENGTH }).map(
                            (_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ),
                          )}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <Button className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span>Verify</span>
              )}
            </Button>
            {verificationType === "two-factor-otp" && (
              <p className="text-center text-sm">
                Didn&apos;t receive the email?{" "}
                <Button
                  variant="link"
                  className="h-fit w-fit p-0"
                  type="button"
                  onClick={onResend}
                >
                  Resend
                </Button>
              </p>
            )}
          </div>
        </form>
      </div>
    </Form>
  );
}
