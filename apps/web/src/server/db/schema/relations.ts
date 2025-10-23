import { relations } from "drizzle-orm";
import {
  users,
  accounts,
  apikeys,
  twoFactors,
  organizations,
  members,
  teams,
  teamMembers,
  invitations,
  organizationRoles,
  verifications,
} from "./auth";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  apiKeys: many(apikeys),
  twoFactors: many(twoFactors),
  members: many(members),
  teamMembers: many(teamMembers),
  invitations: many(invitations),
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

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  teams: many(teams),
  invitations: many(invitations),
  roles: many(organizationRoles),
}));

export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [teams.organizationId],
    references: [organizations.id],
  }),
  teamMembers: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  inviter: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
  // Optional relation to team if teamId is provided (no FK in schema)
  // Drizzle relations require declared references; since teamId isn't FK, we skip `team` relation
}));

export const organizationRolesRelations = relations(
  organizationRoles,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationRoles.organizationId],
      references: [organizations.id],
    }),
  }),
);

export const verificationsRelations = relations(verifications, () => ({}));
