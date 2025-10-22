import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";
import { defaultStatements as orgStatements } from "better-auth/plugins/organization/access";

export const adminStatements = {
  ...defaultStatements,
  organization: ["create", "list", ...orgStatements.organization],
  member: ["list", ...orgStatements.member],
  invitation: ["list", ...orgStatements.invitation],
  team: ["list", ...orgStatements.team],
  ac: [...orgStatements.ac],
} as const;

export const ac = createAccessControl(adminStatements);

export const superAdmin = ac.newRole({
  ...adminAc.statements,
  organization: ["create", "list", ...orgStatements.organization],
  member: ["list", ...orgStatements.member],
  invitation: ["list", ...orgStatements.invitation],
  team: ["list", ...orgStatements.team],
  ac: [...orgStatements.ac],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  organization: ["create", "list", ...orgStatements.organization],
  member: ["list", ...orgStatements.member],
  invitation: ["list", ...orgStatements.invitation],
  team: ["list", ...orgStatements.team],
  ac: [...orgStatements.ac],
});

export const superUser = ac.newRole({
  ...userAc.statements,
  organization: ["create", "list"],
  member: ["list"],
  invitation: [],
  team: ["list"],
  ac: ["read"],
});

export const user = ac.newRole({
  ...userAc.statements,
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: [],
});

export const adminRoles = Object.keys({
  superAdmin,
  admin,
});
