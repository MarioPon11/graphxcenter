import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const vacations = pgTable("vacations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  status: varchar("status", {
    enum: ["pending", "approved", "rejected"],
  }).default("pending"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason").notNull(),
});

export const medicalLeave = pgTable("medical_leave", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  status: varchar("status", {
    enum: ["pending", "approved", "rejected"],
  }).default("pending"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason").notNull(),
});

// TODO Add attendance schema
