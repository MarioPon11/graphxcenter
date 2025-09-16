"use client";

import React, { useState } from "react";
import { WeeklyCalendarView } from "./weekly";
import { MonthlyCalendarView } from "./monthly";
import type { CalendarEvent } from "./event";
import { useQueryState, parseAsString } from "@repo/ui/components/nuqs";
import { cn } from "@repo/ui/lib/utils";

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

export type CalendarViewType = "week" | "month";

export function CalendarView({
  events,
  onEventClick,
  className,
}: CalendarViewProps) {
  const [currentDate] = useState(new Date());
  const [view] = useQueryState("view", parseAsString.withDefault("week"));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg",
        className,
      )}
    >
      {view === "week" ? (
        <WeeklyCalendarView
          events={events}
          currentWeek={currentDate}
          onEventClick={onEventClick}
        />
      ) : (
        <MonthlyCalendarView
          events={events}
          currentMonth={currentDate}
          onEventClick={onEventClick}
        />
      )}
    </div>
  );
}
