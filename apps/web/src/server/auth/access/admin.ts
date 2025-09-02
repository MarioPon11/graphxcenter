import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";

export const adminStatements = {
  ...defaultStatements,
  vacations: ["list", "approve", "delete"],
  attendance: ["list", "update", "delete"],
  medical: ["list", "update", "delete"],
  logs: ["update", "delete"],
  apiKey: ["create", "update", "delete"],
  integration: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(adminStatements);

export const superAdmin = ac.newRole({
  ...adminAc.statements,
  vacations: ["list", "approve", "delete"],
  attendance: ["list", "update", "delete"],
  medical: ["list", "update", "delete"],
  logs: ["update", "delete"],
  apiKey: ["create", "update", "delete"],
  integration: ["create", "update", "delete"],
});

export const humanResources = ac.newRole({
  user: ["create", "list", "ban", "update"],
  session: ["list", "revoke", "delete"],
  vacations: ["list", "approve", "delete"],
  attendance: ["list", "update", "delete"],
  medical: ["list", "update", "delete"],
  logs: [],
  apiKey: [],
  integration: [],
});

export const developer = ac.newRole({
  user: ["create", "list", "ban", "delete", "set-password", "update"],
  session: ["list", "revoke", "delete"],
  vacations: [],
  attendance: [],
  medical: [],
  logs: ["update", "delete"],
  apiKey: ["create", "update", "delete"],
  integration: ["create", "update", "delete"],
});

export const user = ac.newRole({
  ...userAc.statements,
  vacations: [],
  attendance: [],
  medical: [],
  logs: [],
  apiKey: [],
  integration: [],
});

export const adminRoles = Object.keys({ superAdmin });
