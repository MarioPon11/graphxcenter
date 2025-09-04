import { relations } from "drizzle-orm";
import { users, accounts, apikeys, twoFactors } from "./auth";
import { rooms, roomApprovals, roomRules } from "./rooms";
import { eventOccurrences, eventRecurrence, events } from "./events";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  apiKeys: many(apikeys),
  twoFactors: many(twoFactors),
  roomApprovals: many(roomApprovals),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const apikeysRelations = relations(apikeys, ({ one }) => ({
  user: one(users, {
    fields: [apikeys.userId],
    references: [users.id],
  }),
}));

export const twoFactorsRelations = relations(twoFactors, ({ one }) => ({
  user: one(users, {
    fields: [twoFactors.userId],
    references: [users.id],
  }),
}));

export const roomsRelations = relations(rooms, ({ many, one }) => ({
  creator: one(users, {
    fields: [rooms.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [rooms.updatedBy],
    references: [users.id],
  }),
  roomApprovals: many(roomApprovals),
  roomRules: many(roomRules),
  events: many(events),
}));

export const roomRulesRelations = relations(roomRules, ({ one }) => ({
  room: one(rooms, {
    fields: [roomRules.roomId],
    references: [rooms.id],
  }),
  creator: one(users, {
    fields: [roomRules.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [roomRules.updatedBy],
    references: [users.id],
  }),
}));

export const roomApprovalsRelations = relations(roomApprovals, ({ one }) => ({
  room: one(rooms, {
    fields: [roomApprovals.roomId],
    references: [rooms.id],
  }),
  user: one(users, {
    fields: [roomApprovals.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ many, one }) => ({
  room: one(rooms, {
    fields: [events.room],
    references: [rooms.id],
  }),
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [events.updatedBy],
    references: [users.id],
  }),
  eventRecurrence: many(eventRecurrence),
}));

export const eventRecurrenceRelations = relations(
  eventRecurrence,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventRecurrence.eventId],
      references: [events.id],
    }),
    eventOccurrences: many(eventOccurrences),
  }),
);

export const eventOccurrencesRelations = relations(
  eventOccurrences,
  ({ one }) => ({
    event: one(events, {
      fields: [eventOccurrences.eventId],
      references: [events.id],
    }),
    modifiedBy: one(users, {
      fields: [eventOccurrences.createdBy],
      references: [users.id],
    }),
    updatedBy: one(users, {
      fields: [eventOccurrences.updatedBy],
      references: [users.id],
    }),
  }),
);
