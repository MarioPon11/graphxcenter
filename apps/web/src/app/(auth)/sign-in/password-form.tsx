"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeClosed } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { cn } from "@repo/ui/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Checkbox } from "@repo/ui/components/checkbox";

import { Logo } from "@/components/icons";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/server/auth/config";
import { APP_NAME } from "@/constants";
import { toast } from "sonner";
import { signIn } from "@/hooks/auth";

const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`,
    }),
  rememberMe: z.boolean(),
});

export function PasswordForm() {
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const EMAIL_STORAGE_KEY = "auth_email";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    try {
      const savedEmail = sessionStorage.getItem(EMAIL_STORAGE_KEY);
      if (savedEmail) {
        form.setValue("email", savedEmail);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn.email({
      ...values,
      callbackURL: "/dashboard",
    });

    if (res.error) {
      console.log("Error logging in", res.error);
      form.setError("email", { message: res.error.message });
      return;
    }
    toast.success("Signed in successfully");
  }

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url);
  }

  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6")}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-2">
                      <FormLabel>Email</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-0.5 aspect-square size-8 -translate-y-1/2 rounded-full"
                        >
                          {showPassword ? <EyeClosed /> : <Eye />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between gap-2">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Remember me</FormLabel>
                      </FormItem>
                    )}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-500 underline visited:text-blue-400 hover:text-blue-600 hover:no-underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <span>Continue with email</span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setParam("step", null)}
                  className="w-full"
                >
                  Back to login
                </Button>
              </div>
            </div>
          </div>
        </form>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </Form>
  );
}
