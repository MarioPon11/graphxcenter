"use client";

import React, { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CircleCheck } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { cn } from "@repo/ui/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@repo/ui/components/alert-dialog";

import { Logo, Google } from "@/components/icons";
import { APP_NAME } from "@/constants";
import { toast } from "sonner";
import { signIn } from "@/hooks/auth";

const formSchema = z.object({
  email: z.email(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [googleSignIn, setGoogleSignIn] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const EMAIL_STORAGE_KEY = "auth_email";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn.magicLink({
      email: values.email,
    });
    if (res.error) {
      console.log("Error logging in", res.error);
      if (res.error.code === "USER_NOT_FOUND") {
        try {
          sessionStorage.setItem(EMAIL_STORAGE_KEY, values.email);
        } catch {}
        setParam("step", "sign-up");
      }
      form.setError("email", { message: res.error.message });
      return;
    }
    setIsOpen(true);
  }

  function handleGoogleSignIn() {
    setGoogleSignIn(true);
    toast.promise(
      signIn.social({
        provider: "google",
      }),
      {
        loading: "Signing in with Google...",
        success: () => {
          setGoogleSignIn(false);
          return "Signed in with Google";
        },
        error: () => {
          setGoogleSignIn(false);
          return "Failed to sign in with Google";
        },
      },
    );
  }

  function handleContinueWithPassword() {
    try {
      const email = form.getValues("email");
      if (email) sessionStorage.setItem(EMAIL_STORAGE_KEY, email);
    } catch {}
    setParam("step", "sign-in");
  }

  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-col items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-md border">
                <CircleCheck className="size-10 text-green-500" />
              </div>
              <AlertDialogTitle className="text-center">
                Check your email
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div>
              <AlertDialogDescription>
                We&apos;ve sent you an email to verify your account. Please
                click the link in the email to continue, or continue with your
                password by clicking the button below.
              </AlertDialogDescription>
            </div>
            <AlertDialogFooter className="">
              <AlertDialogCancel className="flex-1">Close</AlertDialogCancel>
              <AlertDialogAction
                className="flex-1"
                onClick={handleContinueWithPassword}
              >
                Continue with password
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
                render={({ field, fieldState }) => (
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
                    {!fieldState.error && (
                      <FormDescription>
                        We&apos;ll send you an email to verify your account.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                className="w-full bg-white text-black hover:bg-white/80 active:bg-white/60"
                onClick={handleGoogleSignIn}
                disabled={googleSignIn}
              >
                <Google />
                Continue with Google
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
