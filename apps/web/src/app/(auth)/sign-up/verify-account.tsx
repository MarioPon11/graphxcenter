"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

type VerifyAccountProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void | Promise<void>;
  values: z.infer<typeof formSchema>;
};

export function VerifyAccount({ onSubmit, values }: VerifyAccountProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...values,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-6"
      >
        <div className="space-y-0">
          <h1 className="text-xl font-bold">Verify your account</h1>
          <span className="text-muted-foreground text-sm">
            An email has been sent to your address
          </span>
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <span>Resend email</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
