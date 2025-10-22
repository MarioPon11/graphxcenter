import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/organization/access";

export const organizationStatements = {
  ...defaultStatements,
};

export const organizationAccessControl = createAccessControl(
  organizationStatements,
);
