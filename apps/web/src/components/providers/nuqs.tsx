"use client";

import React from "react";
import { NuqsNextAdapter as NuqsAdapter } from "@repo/ui/nuqs";

export function NuqsProvider({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
