"use client";

import React from "react";
import { AccountsCards } from "@/components/accounts-card";
import { api } from "@/trpc/react";
import { Button } from "@repo/ui/components/button";

export function AccountsForm() {
  const { data } = api.auth.accounts.list.useQuery();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Accounts</h1>
      <AccountsCards />
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          Back
        </Button>
        <Button className="flex-1" disabled={(data?.length ?? 0) <= 1}>
          Next
        </Button>
      </div>
    </div>
  );
}
