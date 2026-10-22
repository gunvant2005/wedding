"use client";

import { createAuthClient } from "better-auth/react";

function getBaseUrl(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
