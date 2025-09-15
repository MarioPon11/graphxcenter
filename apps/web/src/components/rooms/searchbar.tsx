"use client";

import React from "react";

import { parseAsString, useQueryState } from "@repo/ui/components/nuqs";
import { Input } from "@repo/ui/components/input";
import { Search, X as Clear } from "lucide-react";
import { Button } from "@repo/ui/components/button";

export function Searchbar() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
      <Input
        placeholder="Search"
        className="pl-7"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 size-fit -translate-y-1/2 p-0.5"
          onClick={() => setSearch(null)}
        >
          <Clear className="size-4" />
        </Button>
      )}
    </div>
  );
}
