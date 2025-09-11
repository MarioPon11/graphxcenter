import { createRandomStringGenerator } from "@better-auth/utils/random";
import { createHash } from "@better-auth/utils/hash";

export const generateId = (length = 12) =>
  createRandomStringGenerator("A-Z", "a-z", "0-9")(length);
export const generateOTP = (length = 6) =>
  createRandomStringGenerator("0-9")(length);

export const hashBuffer = createHash("SHA-256", "base64");
