/** Normalize Neon connection URLs without corrupting remaining query parameters. */
export function normalizeDatabaseUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use the PostgreSQL protocol");
  }

  // Neon serverless handles TLS itself; dropping this libpq option is safe,
  // but it must be removed as a URL parameter to preserve following options.
  url.searchParams.delete("channel_binding");
  return url.toString();
}