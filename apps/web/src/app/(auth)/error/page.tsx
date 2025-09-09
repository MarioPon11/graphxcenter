"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ServerError } from "@repo/ui/pages/server-error";

export default function ErrorPage() {
  return (
    <main className="h-dvh w-dvw">
      <ServerError
        title="Something went wrong."
        message="We’re experiencing a temporary technical issue on our end. Please try again later, or contact our support team if the problem persists."
        homeLink="/"
      />
    </main>
  );
}
