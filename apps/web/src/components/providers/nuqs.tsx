"use client";

import React from "react";
import { NuqsAdapter } from "@repo/ui/components/nuqs";

export function NuqsProvider({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
