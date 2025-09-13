"use client";

import React from "react";
import { api } from "@/trpc/react";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import { RoomCard } from "@/components/rooms/card";

export function RoomsList() {
  const { data, isLoading, error } = api.rooms.list.useQuery();
  return (
    <div>
      <h1>Rooms</h1>
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-16" />
            ))}
          {data?.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
