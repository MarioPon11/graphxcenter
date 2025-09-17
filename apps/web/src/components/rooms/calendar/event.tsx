"use client";

import React, { useState } from "react";
import { User2 } from "lucide-react";

import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/components/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@repo/ui/components/dialog";
import type { events } from "@/server/db/schema";

const eventVariants = cva(
  "absolute right-0 left-0 mx-1 cursor-pointer rounded px-2 py-1 text-xs font-medium transition-colors duration-150 select-none min-h-fit overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        "chart-1": "bg-chart-1 text-white hover:bg-chart-1/90",
        "chart-2": "bg-chart-2 text-white hover:bg-chart-2/90",
        "chart-3": "bg-chart-3 text-white hover:bg-chart-3/90",
        "chart-4": "bg-chart-4 text-white hover:bg-chart-4/90",
        "chart-5": "bg-chart-5 text-white hover:bg-chart-5/90",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const avatarVariants = cva("rounded-full outline-2", {
  variants: {
    variant: {
      primary: "outline-primary",
      secondary: "outline-secondary",
      accent: "outline-accent",
      "chart-1": "outline-chart-1",
      "chart-2": "outline-chart-2",
      "chart-3": "outline-chart-3",
      "chart-4": "outline-chart-4",
      "chart-5": "outline-chart-5",
    },
  },
});

export type CalendarEvent = VariantProps<typeof eventVariants> &
  typeof events.$inferInsert;

type CalendarEventProps = React.ComponentProps<"div"> &
  VariantProps<typeof eventVariants> & {
    event: CalendarEvent;
    onClick?: (event: CalendarEvent) => void;
    className?: string;
    style?: React.CSSProperties;
  };

export function CalendarEvent({
  event,
  variant,
  onClick,
  className,
  ...props
}: CalendarEventProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const handleClick = () => {
    setOpenDialog(true);
    onClick?.(event);
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(eventVariants({ variant }), className)}
          onClick={handleClick}
          title={`${event.title} - ${event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} to ${event.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          {...props}
        >
          <div className="relative h-full min-h-20">
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
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[150px] text-center" side="right">
        <p>{event.title}</p>
        <div className="bg-accent/30 flex items-center rounded-full p-0.5">
          <div className="flex -space-x-3">
            <Avatar className={avatarVariants({ variant })}>
              <AvatarImage />
              <AvatarFallback>
                <User2 className="size-4" />
              </AvatarFallback>
            </Avatar>
            <Avatar className={avatarVariants({ variant })}>
              <AvatarImage />
              <AvatarFallback>
                <User2 className="size-4" />
              </AvatarFallback>
            </Avatar>
            <Avatar className={avatarVariants({ variant })}>
              <AvatarImage />
              <AvatarFallback>
                <User2 className="size-4" />
              </AvatarFallback>
            </Avatar>
            <Avatar className={avatarVariants({ variant })}>
              <AvatarImage />
              <AvatarFallback>
                <User2 className="size-4" />
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              className="text-muted-foreground hover:text-foreground flex h-fit items-center justify-center rounded-full bg-transparent px-3 pl-5 text-xs shadow-none hover:bg-black/10"
            >
              +3
            </Button>
          </div>
        </div>
      </TooltipContent>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription>
              {event.startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tooltip>
  );
}
