import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";

export const adminStatements = {
  ...defaultStatements,
  rooms: ["create", "update", "delete"],
  roomRules: ["create", "update", "delete"],
  bookings: ["approve", "update", "delete"],
  reocurrance: ["auto-approve", "approve", "delete"],
  logs: ["view", "update"],
} as const;

export const ac = createAccessControl(adminStatements);

export const superAdmin = ac.newRole({
  ...adminAc.statements,
  rooms: ["create", "update", "delete"],
  roomRules: ["create", "update", "delete"],
  bookings: ["approve", "update", "delete"],
  reocurrance: ["approve", "delete"],
  logs: ["view", "update"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  rooms: ["create", "update", "delete"],
  roomRules: ["create", "update", "delete"],
  bookings: ["approve", "update", "delete"],
  reocurrance: ["approve", "delete"],
  logs: ["view", "update"],
});

export const developer = ac.newRole({
  ...userAc.statements,
  rooms: ["create", "update", "delete"],
  roomRules: ["create", "update", "delete"],
  bookings: ["approve", "update", "delete"],
  reocurrance: [],
  logs: ["view", "update"],
});

export const manager = ac.newRole({
  ...userAc.statements,
  rooms: ["update"],
  roomRules: ["update"],
  bookings: ["approve", "update", "delete"],
  reocurrance: ["approve"],
  logs: [],
});

export const user = ac.newRole({
  ...userAc.statements,
  rooms: [],
  roomRules: [],
  bookings: [],
  reocurrance: [],
  logs: [],
});

export const adminRoles = Object.keys({
  superAdmin,
  admin,
  developer,
  manager,
  user,
});
