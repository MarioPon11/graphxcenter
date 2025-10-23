import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";

type VerificationProps = React.ComponentProps<typeof Card>;

export function Verification({ className, ...props }: VerificationProps) {
  return (
    <Card className={cn("min-w-lg", className)} {...props}>
      <CardHeader>
        <CardTitle>Success</CardTitle>
        <CardDescription>
          You have successfully verified your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>You have successfully verified your email address.</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/sign-in">Go to Sign In</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
