"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { FieldGroup } from "@repo/ui/components/field";
import { FormInput, FormPassword } from "@repo/ui/components/form";
import { cn } from "@repo/ui/lib/utils";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/server/auth/config";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@repo/ui/components/card";
import { User } from "@repo/icons/lucide";
import { GxsCloud } from "@repo/icons";
import { Button } from "@repo/ui/components/button";
import { signUp } from "@/hooks/auth";
import { LoadingSwap } from "@repo/ui/components/loading-swap";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
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
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

type FormData = z.infer<typeof formSchema>;

type DetailsFormProps = React.ComponentProps<"form"> & {
  initialEmail?: string;
};

function DetailsForm({ className, initialEmail, ...props }: DetailsFormProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: initialEmail ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormData) {
    const res = await signUp.email({
      ...data,
    });
    if (res.error) {
      toast.error(res.error.message);
    } else {
      router.push("/sign-up?step=verification");
    }
  }

  function handleBack() {
    router.push("/sign-up?step=email");
  }

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      id="details-form"
      {...props}
    >
      <CardContent>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="rounded-full pr-3 pl-1">
            <div className="bg-accent flex size-fit items-center justify-center rounded-full p-1">
              <User className="size-3" />
            </div>
            <p>{initialEmail || "No email"}</p>
          </Badge>
        </div>
        <FieldGroup className="mb-4 gap-2">
          <FormInput
            control={form.control}
            name="name"
            label="Name"
            placeholder="John Doe"
          />
          <FormPassword
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
          />
          <FormPassword
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
          />
        </FieldGroup>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          className="flex-1"
          variant="outline"
          type="button"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button className="flex-1" type="submit" form="details-form">
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Continue
          </LoadingSwap>
        </Button>
      </CardFooter>
    </form>
  );
}

type DetailsFormCardProps = {
  initialEmail?: string;
};

export function DetailsFormCard({ initialEmail }: DetailsFormCardProps) {
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
            Create your account
          </CardTitle>
        </div>
      </CardHeader>
      <DetailsForm initialEmail={initialEmail} />
    </Card>
  );
}
