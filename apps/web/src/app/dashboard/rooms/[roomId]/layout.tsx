import React from "react";
import { api, HydrateClient } from "@/trpc/server";
import { RoomSidebar } from "@/components/rooms/sidebar";
import { SidebarProvider, SidebarInset } from "@repo/ui/components/sidebar";

export default async function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  void api.rooms.get.prefetch({ id: roomId });

  return (
    <HydrateClient>
      <SidebarProvider id={`room-${roomId}`} defaultOpen>
        <SidebarInset className="flex-1 bg-red-100">
          <div>{children}</div>
        </SidebarInset>
        <RoomSidebar />
      </SidebarProvider>
    </HydrateClient>
  );
}
