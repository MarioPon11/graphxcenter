import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  floor: varchar("floor", { enum: ["6th", "7th"] }).default("7th"),
  status: varchar("status", {
    enum: ["active", "inactive", "maintenance"],
  }).default("active"),
  type: varchar("type", {
    enum: ["meeting", "training", "conference", "break"],
  }).default("meeting"),
  capacity: integer("capacity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const roomRules = pgTable("room_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  days: varchar("days", {
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  })
    .array()
    .default(["monday", "tuesday", "wednesday", "thursday", "friday"])
    .notNull(),
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

export const roomApprovals = pgTable(
  "room_approvals",
  {
    roomId: uuid("room_id")
      .references(() => rooms.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.roomId, t.userId] })],
);
