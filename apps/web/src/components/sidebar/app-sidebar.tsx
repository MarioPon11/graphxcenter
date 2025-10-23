import React from "react";
import { headers } from "next/headers";
import type { IconName } from "lucide-react/dynamic";

import { NavAdmin } from "@/components/sidebar/nav-admin";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import { APP_NAME } from "@/constants";
import { GxsCloud } from "@repo/icons";
import { auth } from "@/server/auth";
import { adminRoles } from "@/server/auth/access/admin";

type NavAdminItem = {
  title: string;
  url: string;
  icon?: IconName;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

type NavMainItem = {
  name: string;
  url: string;
  icon: IconName;
  primary?: boolean;
};

const data: { navAdmin: NavAdminItem[]; navMain: NavMainItem[] } = {
  navAdmin: [],
  navMain: [
    { name: "Reservations", url: "#", icon: "ticket-check" },
    { name: "Rooms", url: "/dashboard/rooms", icon: "blocks" },
    { name: "My Calendar", url: "#", icon: "contact" },
  ],
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-4 group-data-[collapsible=icon]:pt-2">
        <div className="flex items-center justify-center gap-2">
          <GxsCloud />
          <span className="group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {adminRoles.includes(session?.user.role ?? "") && (
          <NavAdmin items={data.navAdmin} />
        )}
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
