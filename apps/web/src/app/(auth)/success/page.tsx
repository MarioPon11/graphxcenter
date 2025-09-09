import React from "react";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@repo/ui/components/card";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
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
          <CardAction>Continue</CardAction>
        </CardFooter>
      </Card>
    </main>
  );
}
