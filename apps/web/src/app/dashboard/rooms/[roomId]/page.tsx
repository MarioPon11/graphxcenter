import React from "react";
import { api } from "@/trpc/server";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Searchbar } from "@/components/rooms/searchbar";
import { CalendarView } from "@/components/rooms/calendar/calendar";
import type { CalendarEvent } from "@/components/rooms/calendar/event";
import { ViewSwitch } from "@/components/rooms/view-switch";

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    startTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 1),
    ), // Random day this week
    endTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 1) +
        20 * 60000,
    ), // 20 minutes later
    color: "primary",
  },
  {
    id: "2",
    title: "Project Review",
    startTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 2),
    ), // Random day this week
    endTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 2) +
        50 * 60000,
    ), // 20 minutes duration
    color: "secondary",
  },
  {
    id: "3",
    title: "Client Call",
    startTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 3),
    ), // Random day this week
    endTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 3) +
        80 * 60000,
    ), // 20 minutes duration
    color: "accent",
  },
  {
    id: "4",
    title: "Design Workshop",
    startTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 4),
    ), // Random day this week
    endTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 4) +
        110 * 60000,
    ), // 20 minutes duration
    color: "chart-1",
  },
  {
    id: "5",
    title: "All Day Event",
    startTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 5),
    ), // Random day this week
    endTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 5) +
        140 * 60000,
    ), // 20 minutes duration
    color: "chart-2",
    allDay: true,
  },
  {
    id: "6",
    title: "Lunch Meeting",
    startTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 6),
    ), // Random day this week
    endTime: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 6) +
        170 * 60000,
    ), // 20 minutes duration
    color: "chart-3",
  },
];

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const data = await api.rooms.get({ id: roomId });
  return (
    <div className="size-full space-y-4 pt-2">
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
          <ViewSwitch />
        </div>
      </div>
      <CalendarView events={sampleEvents} />
    </div>
  );
}
