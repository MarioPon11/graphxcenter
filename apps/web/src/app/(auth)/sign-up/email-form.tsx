"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FieldGroup } from "@repo/ui/components/field";
import { FormInput } from "@repo/ui/components/form";
import { Separator } from "@repo/ui/components/separator";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { LoadingSwap } from "@repo/ui/components/loading-swap";
import { GxsCloud } from "@repo/icons";
import { SocialButtons } from "@/components/auth/social-buttons";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});
type FormData = z.infer<typeof formSchema>;

function EmailForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: FormData) {
    //TODO: Implement email verification logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(
      `/sign-up?step=details&email=${encodeURIComponent(data.email)}`,
    );
  }

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      id="email-form"
      {...props}
    >
      <CardContent>
        <SocialButtons />
        <div className="flex w-full items-center gap-4">
          <Separator className="flex-1" />
          <p className="text-muted-foreground text-sm">or continue with</p>
          <Separator className="flex-1" />
        </div>
        <FieldGroup className="gap-2">
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="john.doe@example.com"
          />
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-6">
        <Button className="w-full" type="submit">
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Continue
          </LoadingSwap>
        </Button>
        <p
          className="text-muted-foreground w-full text-center text-xs break-words whitespace-pre-line"
          style={{ maxWidth: 300 }}
        >
          {"By continuing, you agree to our "}
          <br />
          <Link
            href="/terms"
            className="text-blue-400 underline visited:text-blue-500 hover:no-underline"
          >
            Terms of Service
          </Link>
          {" and "}
          <Link
            href="/privacy"
            className="text-blue-400 underline visited:text-blue-500 hover:no-underline"
          >
            Privacy Policy
          </Link>
          {"."}
        </p>
      </CardFooter>
    </form>
  );
}

export function EmailFormCard() {
  return (
    <Card className="min-w-lg">
      <CardHeader className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <GxsCloud className="size-8" />
          <p className="text-lg font-bold">
            Graphx<span className="font-normal">Cloud</span>
          </p>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">
            Sign up to continue
          </CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-blue-400 underline visited:text-blue-500 hover:no-underline"
            >
              Sign in
            </Link>
          </CardDescription>
        </div>
      </CardHeader>
      <EmailForm />
    </Card>
  );
}
