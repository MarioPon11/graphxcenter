"use client";

import type React from "react";

import { cn } from "@repo/ui/lib/utils";

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "chart-1"
    | "chart-2"
    | "chart-3"
    | "chart-4"
    | "chart-5";
  allDay?: boolean;
}

interface CalendarEventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

const eventColorClasses = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  "chart-1": "bg-chart-1 text-white hover:bg-chart-1/90",
  "chart-2": "bg-chart-2 text-white hover:bg-chart-2/90",
  "chart-3": "bg-chart-3 text-white hover:bg-chart-3/90",
  "chart-4": "bg-chart-4 text-white hover:bg-chart-4/90",
  "chart-5": "bg-chart-5 text-white hover:bg-chart-5/90",
};

export function CalendarEvent({
  event,
  onClick,
  className,
  style,
}: CalendarEventProps) {
  const colorClass = eventColorClasses[event.color || "primary"];

  return (
    <div
      className={cn(
        "absolute right-0 left-0 mx-1 cursor-pointer rounded px-2 py-1 text-xs font-medium transition-colors duration-150 select-none",
        colorClass,
        className,
      )}
      style={style}
      onClick={() => onClick?.(event)}
      title={`${event.title} - ${event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} to ${event.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
    >
      <div className="truncate">{event.title}</div>
      {!event.allDay && (
        <div className="truncate text-xs opacity-90">
          {event.startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </div>
  );
}
