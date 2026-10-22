import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";

function getAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET is not set. Generate one with: openssl rand -base64 32",
    );
  }
  return secret;
}

export const auth = betterAuth({
  secret: getAuthSecret(),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: (request) => {
    const defaultOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://10.72.76.202:3000",
      process.env.BETTER_AUTH_URL || "",
      process.env.NEXT_PUBLIC_APP_URL || "",
    ].filter(Boolean);

    if (!request) return defaultOrigins;

    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const xForwardedHost = request.headers.get("x-forwarded-host");
    const xForwardedProto = request.headers.get("x-forwarded-proto") || "http";

    const allowed = [...defaultOrigins];
    if (origin) allowed.push(origin);
    if (host) {
      allowed.push(`http://${host}`);
      allowed.push(`https://${host}`);
    }
    if (xForwardedHost) {
      allowed.push(`${xForwardedProto}://${xForwardedHost}`);
    }

    return Array.from(new Set(allowed));
  },
});

export type Session = typeof auth.$Infer.Session;
