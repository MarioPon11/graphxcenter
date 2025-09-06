import React from "react";
import Link from "next/link";

import { Button } from "@repo/ui/components/button";
import { Logo } from "@/components/icons/logo";

export default function Home() {
  return (
    <main className="flex h-dvh w-dvw flex-col items-center justify-center">
      <Logo />
      <h1>Hello World</h1>
      <Button asChild>
        <Link href="/sign-in">Go to sign in</Link>
      </Button>
    </main>
  );
}
