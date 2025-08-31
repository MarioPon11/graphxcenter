import React from "react";
import { Button } from "@repo/ui/components/button";

export default function Home() {
  return (
    <main className="flex h-dvh w-dvw flex-col items-center justify-center">
      <h1>Hello World</h1>
      <Button variant="destructive">Click me</Button>
    </main>
  );
}
