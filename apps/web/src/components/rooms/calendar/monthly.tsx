"use client";

import {
  type CalendarEvent,
  CalendarEvent as CalendarEventComponent,
} from "./event";
import { cn } from "@repo/ui/lib/utils";

interface MonthlyCalendarViewProps {
  events: CalendarEvent[];
  currentMonth: Date;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthlyCalendarView({
  events,
  currentMonth,
  onEventClick,
  className,
}: MonthlyCalendarViewProps) {
  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );

  // Get the last day of the month
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  );

  // Get the first day of the calendar grid (might be from previous month)
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  // Generate 42 days (6 weeks) for the calendar grid
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    return day;
  });

  // Filter events for each day
  const getEventsForDay = (day: Date) => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === day.toDateString();
      })
      .slice(0, 3); // Limit to 3 events per day for display
  };

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === currentMonth.getMonth();
  };

  const isToday = (day: Date) => {
    return day.toDateString() === new Date().toDateString();
  };

  return (
    <div className={cn("bg-background flex flex-col", className)}>
      {/* Header with days of week */}
      <div className="border-border grid grid-cols-7 border-b">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-muted-foreground border-border border-r p-3 text-center text-sm font-medium last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid flex-1 grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const hasMoreEvents =
            events.filter((event) => {
              const eventDate = new Date(event.startTime);
              return eventDate.toDateString() === day.toDateString();
            }).length > 3;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border-border min-h-32 border-r border-b p-2 last:border-r-0",
                !isCurrentMonth(day) && "bg-muted/30 text-muted-foreground",
                index >= 35 && "border-b-0", // Remove bottom border from last row
              )}
            >
              {/* Day number */}
              <div
                className={cn(
                  "mb-1 text-sm font-medium",
                  isToday(day) &&
                    "bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full",
                  !isCurrentMonth(day) && "text-muted-foreground",
                )}
              >
                {day.getDate()}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.map((event, eventIndex) => (
                  <div key={event.id} className="relative">
                    <CalendarEventComponent
                      event={event}
                      onClick={onEventClick}
                      className="relative mx-0 h-auto px-1 py-0.5 text-xs"
                    />
                  </div>
                ))}

                {hasMoreEvents && (
                  <div className="text-muted-foreground px-1 text-xs">
                    +
                    {events.filter((event) => {
                      const eventDate = new Date(event.startTime);
                      return eventDate.toDateString() === day.toDateString();
                    }).length - 3}{" "}
                    more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
