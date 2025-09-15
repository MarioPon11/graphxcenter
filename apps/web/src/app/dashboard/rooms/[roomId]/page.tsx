import React from "react";
import { api } from "@/trpc/server";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Searchbar } from "@/components/rooms/searchbar";
import { Filters } from "@/components/rooms/filters";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const data = await api.rooms.get({ id: roomId });
  return (
    <div className="size-full pt-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <h1>{data?.name}</h1>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2">
          <Searchbar />
        </div>
        <div className="flex flex-1 flex-row-reverse items-center justify-start gap-2">
          <Button>
            <Plus className="size-4" />
            <span>Add Booking</span>
          </Button>
          <Filters />
        </div>
      </div>
    </div>
  );
}
