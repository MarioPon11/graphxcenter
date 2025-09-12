"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QRCodeCanvas } from "qrcode.react";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { PasswordInput } from "@repo/ui/components/input-password";

import { twoFactor } from "@/hooks/auth";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/server/auth/config";
import { APP_NAME } from "@/constants";

const formSchema = z.object({
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`,
    }),
});

export function TwoFactorForm() {
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await twoFactor.enable({
      ...values,
      issuer: APP_NAME,
    });

    if (res.error) {
      console.log("Error enabling two factor", res.error);
      form.setError("password", {
        message: res.error.message ?? "Failed to enable two factor",
      });
      return;
    }
    setTotpUri(res.data.totpURI);
    setBackupCodes(res.data.backupCodes);
  }

  return (
    <div>
      <h1>Two Factor Authentication</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Please enter your password to enable two factor authentication.
          </p>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full max-w-sm" variant="secondary">
            Enable Two Factor Authentication
          </Button>
        </form>
      </Form>
      <Dialog open={!!totpUri}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div>
            <QRCodeCanvas
              value={totpUri ?? ""}
              size={256}
              level="M"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#111827"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary">
              Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
