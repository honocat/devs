export function json(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers)
  headers.set("Coontent-Type", "application/json")
  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  })
}
