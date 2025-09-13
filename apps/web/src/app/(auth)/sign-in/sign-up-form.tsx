"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeClosed } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

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
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";

import { Logo } from "@/components/icons";
import { APP_NAME } from "@/constants";
import { signUp } from "@/hooks/auth";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/server/auth/config";
import { toast } from "sonner";

const formSchema = z
  .object({
    email: z.email().refine((email) => email.includes("@graphxsource"), {
      error: "Only graphxsource emails are allowed",
    }),
    name: z.string().min(1),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, {
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .max(MAX_PASSWORD_LENGTH, {
        error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`,
      }),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const EMAIL_STORAGE_KEY = "auth_email";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
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
    toast("Signin up with email");
    const res = await signUp.email({
      email: values.email,
      name: values.name,
      password: values.password,
    });

    if (res.error) {
      console.log("Error signing up", res.error);
      if (res.error.code === "FAILED_TO_CREATE_USER") {
        form.setError("root", {
          message: res.error.message ?? "Failed to create user",
        });
      } else {
        form.setError("email", { message: res.error.message });
      }
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString();
    const url = query
      ? `/verify?verification=email-verification&${query}`
      : "/verify?verification=email-verification";

    router.push(url);
  }

  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                Enter your information to create an account.
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" tabIndex={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        tabIndex={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="pr-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          tabIndex={3}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        className="absolute top-1/2 right-0.5 aspect-square size-8 -translate-y-1/2 rounded-full"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="pr-10"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                          tabIndex={4}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        className="absolute top-1/2 right-0.5 aspect-square size-8 -translate-y-1/2 rounded-full"
                        variant="ghost"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
                tabIndex={5}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <span>Continue with email</span>
                )}
              </Button>
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
