import { fileURLToPath } from "node:url";
import { createJiti } from "jiti"

const jiti = createJiti(fileURLToPath(import.meta.url));
await jiti.import("./src/env/server.ts");
await jiti.import("./src/env/client.ts");

/** @type {import("next").NextConfig} */
const config = {
    transpilePackages: ["@repo/ui"],
};

export default config;
