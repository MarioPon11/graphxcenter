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
import { Button } from "@repo/ui/components/button";
import { GxsCloud } from "@repo/icons";
import { SignInForm } from "@/components/auth/sign-in/form";
import { APP_NAME } from "@/constants";
import { cn } from "@repo/ui/lib/utils";

export default function SignInPage() {
  return (
    <Card className="min-w-lg">
      <CardHeader className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <GxsCloud className="size-8" />
            <h3>
              {APP_NAME.map((name, index) => (
                <span
                  key={index}
                  className={cn(
                    "text-2xl font-bold",
                    index === APP_NAME.length - 1 && "font-normal italic",
                  )}
                >
                  {name}
                </span>
              ))}
            </h3>
          </Link>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">
            Log in to your account
          </CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-400 underline visited:text-blue-500 hover:no-underline"
            >
              Sign up
            </Link>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" form="sign-in-form">
          Sign in
        </Button>
      </CardFooter>
    </Card>
  );
}
