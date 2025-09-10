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
import { verifyEmail, emailOtp } from "@/hooks/auth";
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
  const router = useRouter();
  const otpValue = searchParams.get("otp") ?? "";
  const emailValue = searchParams.get("sign-up") ?? "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: otpValue,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await verifyEmail({
      query: { token: values.otp, callbackURL: "/sign-up" },
    });
    if (res.error) {
      console.log("Error verifying email", res.error);
    }
  }

  async function onResend() {
    toast.success(`Sending verification OTP to ${emailValue}`);
    const res = await emailOtp.sendVerificationOtp({
      email: emailValue,
      type: "email-verification",
    });

    if (res.error) {
      console.log("Error sending verification email", res.error);
      form.setError("root", {
        message: res.error.message ?? "Failed to send verification email",
      });
    }
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
              render={({ field }) => (
                <FormItem className="mx-auto w-fit">
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
          </div>
          <div className="space-y-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <Button
                type="submit"
                className="w-full max-w-xs"
                disabled={form.formState.isSubmitting}
              >
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
          </div>
        </form>
      </div>
    </Form>
  );
}
