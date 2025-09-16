"use client";

import {
  type CalendarEvent,
  CalendarEvent as CalendarEventComponent,
} from "./event";
import { cn } from "@repo/ui/lib/utils";

interface WeeklyCalendarViewProps {
  events: CalendarEvent[];
  currentWeek: Date;
  className?: string;
}

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  return {
    hour,
    label:
      hour === 0
        ? "12 AM"
        : hour < 12
          ? `${hour} AM`
          : hour === 12
            ? "12 PM"
            : `${hour - 12} PM`,
  };
});

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyCalendarView({
  events,
  currentWeek,
  className,
}: WeeklyCalendarViewProps) {
  const startOfWeek = new Date(currentWeek);
  startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const getEventsForDay = (day: Date) => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === day.toDateString();
      })
      .map((event) => {
        const startHour = event.startTime.getHours();
        const startMinute = event.startTime.getMinutes();
        const endHour = event.endTime.getHours();
        const endMinute = event.endTime.getMinutes();

        const top = ((startHour * 60 + startMinute) / 60) * 60;
        const duration =
          (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;
        const height = Math.max(duration * 60, 20);

        return {
          ...event,
          style: {
            top: `${top}px`,
            height: `${height}px`,
            zIndex: 10,
          },
        };
      });
  };

  return (
    <div className={cn("bg-background flex flex-col", className)}>
      <div className="border-border grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
        <div className="text-muted-foreground p-2 text-sm font-medium" />
        {weekDays.map((day, index) => (
          <div
            key={day.toISOString()}
            className="border-border border-r border-b p-2 text-center last:border-r-0"
          >
            <div className="text-muted-foreground text-sm font-medium">
              {daysOfWeek[index]}
            </div>
            <div
              className={cn(
                "mt-1 text-lg font-semibold",
                day.toDateString() === new Date().toDateString()
                  ? "text-primary-foreground bg-primary mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                  : "text-foreground",
              )}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="relative flex-1">
        <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
          {/* Time column */}
          <div>
            {timeSlots.map((slot) => (
              <div
                key={slot.hour}
                className="text-muted-foreground h-15 p-2 text-xs"
              >
                {slot.label}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="border-border relative border-r last:border-r-0"
            >
              {/* Hour lines */}
              {timeSlots.map((slot) => (
                <div key={slot.hour} className="border-border h-15 border-b" />
              ))}

              {/* Events for this day */}
              <div className="absolute inset-0">
                {getEventsForDay(day).map((event) => (
                  <CalendarEventComponent
                    key={event.id}
                    event={event}
                    style={event.style}
                    variant={event.variant}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
