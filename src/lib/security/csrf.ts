/**
 * Lightweight CSRF protection for API routes.
 * Verifies the Origin / Referer header against the configured app URL.
 */
export function verifyCsrf(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000";

  // In development, allow same-origin
  const allowedOrigin = new URL(appUrl).origin;

  if (origin) {
    return origin === allowedOrigin;
  }

  if (referer) {
    try {
      return new URL(referer).origin === allowedOrigin;
    } catch {
      return false;
    }
  }

  // No Origin or Referer header — likely a server-side or non-browser request.
  // Reject unless it's a same-origin fetch (browsers always send Origin on POST).
  return false;
}

export function csrfError(): Response {
  return Response.json(
    { error: "CSRF validation failed. Request origin not allowed." },
    { status: 403 },
  );
}
