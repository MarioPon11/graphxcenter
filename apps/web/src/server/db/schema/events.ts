import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { users, accounts } from "./auth";

export const calendars = pgTable("calendars", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerUserId: text("owner_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  color: varchar("color", { length: 16 }),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  calendarId: uuid("calendar_id").references(() => calendars.id, {
    onDelete: "set null",
  }),
  // ICS-friendly identifiers
  uid: varchar("uid", { length: 255 }).notNull(), // globally unique across systems
  prodId: varchar("prod_id", { length: 255 }), // optional ICS prod identifier
  etag: varchar("etag", { length: 255 }), // for sync/versioning with providers

  // Basic details
  title: varchar("title", { length: 512 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 512 }),
  allDay: boolean("all_day").default(false).notNull(),

  // Times (store UTC), with original timezone context for wall-time rendering
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  timeZone: varchar("time_zone", { length: 64 }).notNull(), // IANA TZ

  // Recurrence and exceptions
  // If non-null, this event is a recurring "master"
  rrule: text("rrule"), // RFC RRULE string (e.g., "FREQ=WEEKLY;BYDAY=MO,WE")
  // EXDATEs cancel specific instances
  exdates: timestamp("exdates", { withTimezone: true }).array(),
  rdates: timestamp("rdates", { withTimezone: true }).array(),

  // Visibility and status
  transparency: varchar("transparency", { enum: ["opaque", "transparent"] })
    .default("opaque")
    .notNull(),
  visibility: varchar("visibility", {
    enum: ["default", "public", "private"],
  }).default("default"),
  status: varchar("status", {
    enum: ["confirmed", "tentative", "cancelled"],
  }).default("confirmed"),

  organizerUserId: text("organizer_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const eventOverrides = pgTable("event_overrides", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),

  // Points to which occurrence is overridden
  recurrenceId: timestamp("recurrence_id", { withTimezone: true }).notNull(), // original instance start in UTC

  // Override fields (nullable: only set what changed)
  title: varchar("title", { length: 512 }),
  description: text("description"),
  location: varchar("location", { length: 512 }),
  allDay: boolean("all_day"),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  status: varchar("status", {
    enum: ["confirmed", "tentative", "cancelled"],
  }),

  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  // For provider sync of detached instances
  uid: varchar("uid", { length: 255 }), // detached instances can have own UID in some systems
  etag: varchar("etag", { length: 255 }),
});

export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  // If an override-specific invitee state is ever needed, add recurrenceId nullable
  email: varchar("email", { length: 320 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }), // internal mapping
  role: varchar("role", {
    enum: ["organizer", "required", "optional", "resource"],
  }).default("required"),
  responseStatus: varchar("response_status", {
    enum: ["needsAction", "declined", "tentative", "accepted"],
  }).default("needsAction"),
  // ICS: PARTSTAT, ROLE, CUTYPE, RSVP, etc. Add as needed
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  // Unique per event/email
});

export const eventReminders = pgTable("event_reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  method: varchar("method", { enum: ["popup", "email", "webhook"] })
    .default("popup")
    .notNull(),
  minutesBeforeStart: integer("minutes_before_start").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const conferencing = pgTable("conferencing", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  provider: varchar("provider", {
    enum: ["google_meet", "slack", "teams"],
  }).notNull(),
  joinUrl: text("join_url").notNull(),
  meetingId: varchar("meeting_id", { length: 255 }),
  passcode: varchar("passcode", { length: 255 }),
  data: jsonb("data"), // provider payload
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const calendarSyncStates = pgTable("calendar_sync_states", {
  id: uuid("id").primaryKey().defaultRandom(),
  calendarId: text("calendar_id")
    .references(() => accounts.accountId, { onDelete: "cascade" })
    .notNull(),
  provider: varchar("provider", { enum: ["google"] }).notNull(),
  // Google incremental sync
  syncToken: text("sync_token"),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const providerEventMappings = pgTable("provider_event_mappings", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  provider: varchar("provider", { enum: ["google"] }).notNull(),
  providerCalendarId: varchar("provider_calendar_id", {
    length: 255,
  }).notNull(),
  providerEventId: varchar("provider_event_id", { length: 255 }).notNull(),
  providerEtag: varchar("provider_etag", { length: 255 }),
  // For detached instances in Google, store their IDs optionally
  recurrenceId: timestamp("recurrence_id", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const expandedOccurrences = pgTable("expanded_occurrences", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  // Start of occurrence (post-override if present)
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  recurrenceId: timestamp("recurrence_id", { withTimezone: true }), // original start
  isOverride: boolean("is_override").default(false).notNull(),
  status: varchar("status", {
    enum: ["confirmed", "tentative", "cancelled"],
  }).default("confirmed"),
  // denorm for fast queries
  allDay: boolean("all_day").default(false).notNull(),
  timeZone: varchar("time_zone", { length: 64 }).notNull(),
  calendarId: uuid("calendar_id").notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
