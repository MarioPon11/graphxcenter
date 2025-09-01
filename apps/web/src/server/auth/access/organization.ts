import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/organization/access";

export const orgStatements = {
  ...defaultStatements,
} as const;

export const orgAc = createAccessControl(orgStatements);

export const departmentManager = orgAc.newRole({
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
});

export const departmentTeamLead = orgAc.newRole({
  organization: [],
  member: ["delete", "create", "update"],
  invitation: ["create", "cancel"],
  team: ["update"],
});

export const member = orgAc.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
});
