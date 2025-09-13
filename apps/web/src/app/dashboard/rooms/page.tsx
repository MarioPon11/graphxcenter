import React from "react";
import { api, HydrateClient } from "@/trpc/server";
import { RoomsList } from "./list";

export default async function Rooms() {
  void api.rooms.list.prefetch();

  return (
    <HydrateClient>
      <div>
        <RoomsList />
      </div>
    </HydrateClient>
  );
}
