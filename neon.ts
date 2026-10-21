/**
 * Neon branch config. After `neon init` / link, replace with:
 *   import { defineConfig } from "@neon/config/v1";
 *   export default defineConfig({ auth: true, aiGateway: true });
 * then run `neon deploy` and `neon env pull`.
 *
 * Auth + AI Gateway need a Neon project in a supported AWS region.
 * Free plans: use DATABASE_URL + OPENAI_API_KEY (see README).
 */
const config = {
  auth: true as const,
  aiGateway: true as const,
};

export default config;
