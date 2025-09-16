"use client";

import React from "react";
import { Columns3, CalendarDays } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { useQueryState, parseAsString } from "@repo/ui/components/nuqs";
import { cn } from "@repo/ui/lib/utils";

type ViewSwitchProps = {
  className?: string;
};

export function ViewSwitch({ className }: ViewSwitchProps) {
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault("week"),
  );
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={setView}
      className={cn("border", className)}
    >
      <ToggleGroupItem value="week">
        <Columns3 />
      </ToggleGroupItem>
      <ToggleGroupItem value="month">
        <CalendarDays />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
