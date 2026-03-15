export function getEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function requireEnv(name: string, message?: string): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(message ?? `${name} が設定されていません。`);
  }
  return value;
}

export function requireOneOfEnv(
  names: string[],
  message: string,
): { name: string; value: string } {
  for (const name of names) {
    const value = getEnv(name);
    if (value) {
      return { name, value };
    }
  }

  throw new Error(message);
}

