"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@repo/ui/components/card";
import { ActionButton } from "@repo/ui/components/action-button";
import { Google } from "@/components/icons";

import { api } from "@/trpc/react";
import { linkSocial, unlinkAccount } from "@/hooks/auth";
import { cn } from "@repo/ui/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

type AccountCardProps = React.ComponentProps<"div">;

export function AccountsCards({ className, ...props }: AccountCardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data } = api.auth.accounts.list.useQuery();

  async function linkGoogle() {
    const callbackURL = `${pathname}?${searchParams.toString()}`;

    if (data?.some((account) => account.providerId === "google")) {
      const res = await unlinkAccount({
        providerId: "google",
      });

      if (res.error) {
        return { error: true, message: res.error.message };
      }
      return { error: false, message: "Google account unlinked successfully" };
    } else {
      const res = await linkSocial({
        provider: "google",
        callbackURL,
      });

      if (res.error) {
        return { error: true, message: res.error.message };
      }
      return { error: false, message: "Google account linked successfully" };
    }
  }

  return (
    <div className={cn("w-full gap-4", className)} {...props}>
      <Card className="flex w-full flex-row items-center justify-between">
        <CardHeader className="flex flex-1 gap-4">
          <Google className="size-8" />
          <div className="flex-1 space-y-1 text-start">
            <CardTitle>Google</CardTitle>
            <CardDescription>
              Link your Google account to your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter>
          <ActionButton
            variant="outline"
            action={linkGoogle}
            className={cn(
              data?.some((account) => account.providerId === "google") &&
                "!border-green-500 text-green-500",
            )}
          >
            {data?.some((account) => account.providerId === "google") ? (
              <span>Connected</span>
            ) : (
              <span>Connect</span>
            )}
          </ActionButton>
        </CardFooter>
      </Card>
    </div>
  );
}
