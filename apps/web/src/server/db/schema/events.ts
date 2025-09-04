import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { rooms } from "./rooms";
import { users } from "./auth";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  room: uuid("room")
    .references(() => rooms.id, { onDelete: "cascade" })
    .notNull(),
  status: varchar("status", {
    enum: ["pending", "approved", "rejected", "cancelled"],
  }).default("pending"),
  approvedBy: text("approved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  startTime: timestamp("start_time", { withTimezone: false }).notNull(),
  endTime: timestamp("end_time", { withTimezone: false }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const eventRecurrence = pgTable("event_recurrence", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  frequency: varchar("frequency", {
    enum: ["daily", "weekly", "monthly", "yearly"],
  }).notNull(),
  interval: integer("interval").default(1), // every N weeks/months/etc
  byWeekDay: varchar("by_week_day", {
    length: 2,
    enum: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
  }).array(),
  byMonthDay: integer("by_month_day").array(), // [1, 15, -1] for 1st, 15th, last day
  bySetPos: integer("by_set_pos").array(), // [1, -1] for first and last
  byMonth: integer("by_month").array(),
  until: timestamp("until", { withTimezone: true }),
  count: integer("count"),
  dtStart: timestamp("dt_start", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventOccurrences = pgTable("event_occurrences", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  status: varchar("status", {
    enum: ["active", "cancelled", "modified"],
  }).default("active"),
  modifiedStartTime: timestamp("modified_start_time", { withTimezone: true }),
  modifiedEndTime: timestamp("modified_end_time", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
});
