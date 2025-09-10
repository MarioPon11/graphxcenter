import React from "react";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; callbackUrl?: string }>;
}) {
  const { message, callbackUrl } = await searchParams;
  return (
    <main className="h-dvh w-dvw">
      <Card>
        <CardHeader>
          <CardTitle>Success</CardTitle>
          <CardDescription>
            {message ?? "You have been successfully logged in"}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <CardAction>
            <Button asChild>
              <Link href={callbackUrl ?? "/dashboard"}>Continue</Link>
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </main>
  );
}
