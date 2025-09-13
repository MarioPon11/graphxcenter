"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import type { rooms } from "@/server/db/schema";

type RoomCardProps = React.ComponentProps<typeof Card> & {
  room: typeof rooms.$inferSelect;
};

export function RoomCard({ room, className, ...props }: RoomCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="space-y-0.5">
        <CardTitle className="text-xl font-bold">{room.name}</CardTitle>
        <div className="flex gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "capitalize",
              room.status === "active" && "bg-green-500",
            )}
          >
            {room.status}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {room.type} room
          </Badge>
          <Badge variant="outline" className="capitalize">
            {room.floor} floor
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{room.description}</CardDescription>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/rooms/${room.id}`}>View</Link>
        </Button>
        <Button>Quick Book</Button>
      </CardFooter>
    </Card>
  );
}
