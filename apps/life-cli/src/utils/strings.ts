export function optionalTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function requiredTrim(value: unknown, message: string): string {
  const trimmed = optionalTrim(value);
  if (!trimmed) {
    throw new Error(message);
  }
  return trimmed;
}

