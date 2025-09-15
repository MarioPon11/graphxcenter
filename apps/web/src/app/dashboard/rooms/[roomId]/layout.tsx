import React from "react";
import { api, HydrateClient } from "@/trpc/server";
import { RoomSidebar } from "@/components/rooms/sidebar";

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
      <div className="size-full">{children}</div>
      <RoomSidebar />
    </HydrateClient>
  );
}
