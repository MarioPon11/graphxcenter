import React from "react";
import { api, HydrateClient } from "@/trpc/server";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const data = await api.rooms.get({ id: roomId });
  return (
    <div>
      <h1>{data?.name}</h1>
    </div>
  );
}
