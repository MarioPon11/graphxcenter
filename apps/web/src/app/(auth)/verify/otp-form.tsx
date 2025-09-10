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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { emailOtp } from "@/hooks/auth";
import { OTP_LENGTH } from "@/server/auth/config";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { cn } from "@repo/ui/lib/utils";

import { Logo } from "@/components/icons";
import { APP_NAME } from "@/constants";

const formSchema = z.object({
  otp: z
    .string()
    .min(OTP_LENGTH, { error: "OTP is required" })
    .max(OTP_LENGTH, { error: "OTP is required" }),
  email: z.email(),
});

/* TODO Check logic for this form since it could be reused for other types of verifications */
export function OtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const otpValue = searchParams.get("otp") ?? "";
  const emailValue = searchParams.get("sign-up") ?? "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: otpValue,
      email: emailValue,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.email) {
      form.setError("root", {
        message: "Email is required for verification",
      });
      return;
    }

    try {
      const res = await emailOtp.checkVerificationOtp({
        email: values.email,
        otp: values.otp,
        type: "sign-in",
      });

      if (res.error) {
        console.log("Error verifying email", res.error);
        if (res.error.code === "INVALID_OTP") {
          form.setError("otp", {
            message: res.error.message ?? "Invalid OTP",
          });
          return;
        }
        form.setError("root", {
          message: res.error.message ?? "Failed to verify email",
        });
        return;
      }

      toast.success("Email verified successfully!");
      router.push("/sign-up"); // or wherever you want to redirect after verification
    } catch (error) {
      console.error("Verification error:", error);
      form.setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }

  async function onResend() {
    if (!emailValue) {
      form.setError("root", {
        message: "Email is required to resend verification",
      });
      return;
    }
    const res = await emailOtp.sendVerificationOtp({
      email: emailValue,
      type: "sign-in",
    });

    if (res.error) {
      console.log("Error sending verification email", res.error);
      form.setError("root", {
        message: res.error.message ?? "Failed to send verification email",
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
          className="w-full space-y-6"
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
              Check your email for the verification token.
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
          <div className="flex w-full flex-col gap-2">
            <FormField
              control={form.control}
              name="otp"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={OTP_LENGTH} {...field}>
                      <InputOTPGroup>
                        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  {!fieldState.error && (
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                  )}
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
            <p className="text-center text-sm">
              Didn&apos;t receive the email?{" "}
              <Button
                variant="link"
                className="h-fit w-fit p-0"
                onClick={onResend}
              >
                Resend
              </Button>
            </p>
          </div>
        </form>
      </div>
    </Form>
  );
}
