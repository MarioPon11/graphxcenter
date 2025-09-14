"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import { Calendars } from "@/components/rooms/calendars";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@repo/ui/components/sidebar";
import { Calendar } from "@repo/ui/components/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@repo/ui/lib/utils";

// This is sample data.
const data = {
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function RoomSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [date, setDate] = useState<Date | undefined>();
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="offcanvas"
      className={cn(
        "top-0 hidden h-svh border-l lg:flex",
        pathname.includes("/dashboard/rooms/") && "sticky",
      )}
      {...props}
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <div>
          <h1>My Calendar</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
