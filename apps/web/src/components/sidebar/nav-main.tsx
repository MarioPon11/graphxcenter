"use client";
import React from "react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { cn } from "@repo/ui/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: IconName;
    primary?: boolean;
  }[];
}) {
  return (
    <SidebarGroup className="">
      <SidebarGroupLabel>Calendar</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={cn(
                item.primary &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
              )}
            >
              <a href={item.url}>
                <DynamicIcon name={item.icon} />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
