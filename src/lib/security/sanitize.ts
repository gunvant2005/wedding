/**
 * Sanitize user-controlled strings before embedding in AI prompts.
 * Strips common prompt-injection patterns and limits length.
 */
export function sanitizeForPrompt(input: string, maxLength = 500): string {
  if (!input) return "";

  let cleaned = input
    // Remove common prompt-injection patterns
    .replace(/ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, "[filtered]")
    .replace(/you\s+are\s+now\s+/gi, "[filtered]")
    .replace(/system\s*:\s*/gi, "[filtered]")
    .replace(/\[INST\]/gi, "[filtered]")
    .replace(/<\/?(?:system|user|assistant|s|\/s)>/gi, "[filtered]")
    // Remove excessive whitespace
    .replace(/\s+/g, " ")
    .trim();

  // Truncate to max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength) + "…";
  }

  return cleaned;
}

/**
 * Wraps user content in clear delimiters to help the LLM distinguish
 * user data from system instructions.
 */
export function delimitUserContent(label: string, value: string): string {
  const sanitized = sanitizeForPrompt(value);
  if (!sanitized) return `${label}: N/A`;
  return `${label}: """${sanitized}"""`;
}
