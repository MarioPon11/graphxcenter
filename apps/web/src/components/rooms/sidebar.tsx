"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import { Calendars } from "@/components/rooms/filters";
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

function SecondarySidebarMount({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const slot = document.getElementById("secondary-sidebar-slot");
  if (!slot) return null;
  return ReactDOM.createPortal(children, slot);
}

export function RoomSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [date, setDate] = useState<Date | undefined>();
  const { setOpen } = useSidebar();

  return (
    <SecondarySidebarMount>
      <Sidebar
        collapsible="none"
        className={cn("sticky top-0 hidden h-dvh border-l lg:flex")}
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
    </SecondarySidebarMount>
  );
}
