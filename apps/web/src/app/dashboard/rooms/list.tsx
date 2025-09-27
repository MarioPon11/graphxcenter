"use client";

import React from "react";
import { api } from "@/trpc/react";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import { EmptyState } from "@repo/ui/pages/empty-state";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@repo/ui/components/dialog";

import { RoomCard } from "@/components/rooms/card";

export function RoomsList() {
  const { data, isLoading, error } = api.rooms.list.useQuery();
  return (
    <div className="h-full">
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
      {data?.length === 0 && (
        <div className="flex h-full items-center justify-center md:col-span-2 lg:col-span-3">
          <EmptyState>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create Room</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Room</DialogTitle>
                  <DialogDescription>Create a new room</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </EmptyState>
        </div>
      )}
    </div>
  );
}
