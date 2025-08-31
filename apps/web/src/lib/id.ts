import { createRandomStringGenerator } from "@better-auth/utils/random";
import { createHash } from "@better-auth/utils/hash";

export const generateId = createRandomStringGenerator("A-Z", "a-z", "0-9");

export const hashBuffer = createHash("SHA-256", "base64");
