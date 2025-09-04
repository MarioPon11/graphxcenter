"use client";

import React from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";

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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";

import { Logo, Google } from "@/components/icons";
import { APP_NAME } from "@/constants";

const formSchema = z.object({
  email: z.email(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                Don&apos;t have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign up
                </Link>
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
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 -translate-y-0.5" />
                        </TooltipTrigger>
                        <TooltipContent>
                          We&apos;ll send you an email to verify your account.
                        </TooltipContent>
                      </Tooltip>
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
              <Button type="submit" className="w-full">
                Login
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
