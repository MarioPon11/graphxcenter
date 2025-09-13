"use client";

import React from "react";
import { Check } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";

export function Success() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="rounded-full bg-green-500 p-2 text-white outline-2 outline-offset-2 outline-green-500">
        <Check className="size-5" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Account created successfully</h1>
        <p className="text-muted-foreground text-sm">
          You can now login to your account
        </p>
      </div>
      <Button asChild className="w-full max-w-xs">
        <Link href="/dashboard">Continue</Link>
      </Button>
    </div>
  );
}
