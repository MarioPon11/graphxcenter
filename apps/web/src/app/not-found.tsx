import React from "react";
import { NotFound } from "@repo/ui/pages/not-found";

export default function NotFoundPage() {
  return (
    <main className="h-dvh w-dvw">
      <NotFound
        title="Page not found"
        message="The page you are looking for does not exist."
        homeLink="/"
      />
    </main>
  );
}
