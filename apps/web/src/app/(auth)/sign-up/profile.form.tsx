"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeClosed } from "lucide-react";

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
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/server/auth/config";

const formSchema = z
  .object({
    name: z.string().min(1, { error: "Name is required" }),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, {
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .max(MAX_PASSWORD_LENGTH, {
        error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters`,
      }),
    confirmPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH)
      .max(MAX_PASSWORD_LENGTH),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword", "password"],
    message: "Passwords do not match",
  });

type ProfileFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void | Promise<void>;
  onBack: () => void | Promise<void>;
};

export function ProfileForm({ onSubmit, onBack }: ProfileFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
              <div className="relative flex items-center gap-2">
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    {...field}
                  />
                </FormControl>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0.5 rounded-full"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
              <div className="relative flex items-center gap-2">
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                    {...field}
                  />
                </FormControl>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0.5 rounded-full"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeClosed /> : <Eye />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            className="flex-1"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button type="submit" className="flex-1">
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
