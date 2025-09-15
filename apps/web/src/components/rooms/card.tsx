"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Blocks, User2 } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/utils";
import type { rooms } from "@/server/db/schema";

type RoomCardProps = React.ComponentProps<typeof Card> & {
  room: typeof rooms.$inferSelect;
};

export function RoomCard({ room, className, ...props }: RoomCardProps) {
  return (
    <Card className={cn("h-full w-full", className)} {...props}>
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
          <TooltipProvider skipDelayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="pl-1.5 capitalize">
                  <Blocks />
                  <span>{room.type} room</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-[150px] text-center">
                {room.type === "meeting" && (
                  <p>
                    <b>Meeting rooms</b> are small rooms used for small huddles,
                    1 on 1 meetings, or small group discussions.
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="pl-1 capitalize">
                  <MapPin />
                  <span>{room.floor} floor</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This room is located on the {room.floor} floor.</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="pl-1 capitalize">
                  <User2 />
                  <span>{room.capacity} capacity</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This room can accommodate {room.capacity} people.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">
          {room.description}
        </CardDescription>
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
