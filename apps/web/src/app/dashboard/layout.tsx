import React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@repo/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DynamicBreadcrumb } from "@/components/sidebar/breadcrumbs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
          </header>
          <main className="flex-1">
            <div className="h-full w-full overflow-scroll px-4 pb-4">
              {children}
            </div>
          </main>
        </SidebarInset>
        <div id="secondary-sidebar-slot" className="relative z-0" />
      </div>
    </SidebarProvider>
  );
}
