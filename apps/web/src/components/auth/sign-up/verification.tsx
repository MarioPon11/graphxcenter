import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";
import { CheckCircle } from "@repo/icons/lucide";

type VerificationProps = React.ComponentProps<typeof Card>;

export function Verification({ className, ...props }: VerificationProps) {
  return (
    <Card className={cn("min-w-lg", className)} {...props}>
      <CardHeader className="flex flex-col items-center gap-2 text-center">
        <div className="bg-accent mb-4 rounded-lg border p-2">
          <CheckCircle className="size-10 text-green-500" />
        </div>
        <CardTitle>One more step</CardTitle>
        <CardDescription>
          We've sent a verification link to your email address. Please click the
          link to verify your email address.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button asChild className="w-full">
          <Link href="/sign-in">Go to Sign In</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
