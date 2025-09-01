import React from "react";
import { Button } from "@repo/ui/components/button";
import { Logo } from "@/components/icons/logo";

export default function Home() {
  return (
    <main className="flex h-dvh w-dvw flex-col items-center justify-center">
      <Logo />
      <h1>Hello World</h1>
      <Button variant="destructive">Click me</Button>
    </main>
  );
}
