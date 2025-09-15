"use client";

import React from "react";
import { SlidersHorizontal, Columns3, CalendarDays } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@repo/ui/components/dropdown-menu";
import { useQueryState, parseAsString } from "@repo/ui/components/nuqs";

export function Filters() {
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault("week"),
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal />
          <span>Views & Filters</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Views</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={view} onValueChange={setView}>
            <DropdownMenuRadioItem value="week">
              <Columns3 />
              <span>Week</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="month">
              <CalendarDays />
              <span>Month</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filters</DropdownMenuLabel>
          <DropdownMenuItem>
            <Columns3 />
            <span>Example Item</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
