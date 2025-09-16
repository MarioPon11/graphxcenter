"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

type EmptyStateProps = React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
};

export function EmptyState({
  className,
  children,
  title = "No items to display",
  description = "You haven't added any records yet. Click bellow to add your first item.",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center size-full gap-8 max-w-sm",
        className
      )}
      {...props}
    >
      <div className="border p-1 rounded-md">
        <Search className="size-6" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
