import { createAuthClient } from "better-auth/react";
import {
  twoFactorClient,
  usernameClient,
  magicLinkClient,
  emailOTPClient,
  adminClient,
  apiKeyClient,
  organizationClient,
  multiSessionClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    usernameClient(),
    magicLinkClient(),
    emailOTPClient(),
    adminClient(),
    apiKeyClient(),
    organizationClient(),
    multiSessionClient(),
  ],
});
