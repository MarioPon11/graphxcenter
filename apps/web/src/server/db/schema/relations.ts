import { relations } from "drizzle-orm";
import { users, accounts, apikeys, twoFactors } from "./auth";
import { rooms, roomApprovals, roomRules } from "./rooms";

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
