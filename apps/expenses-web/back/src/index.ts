import { Hono } from "hono";

type Bindings = {
  GITHUB_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const GITHUB_API_TOKEN = "";
  const owner = "honocat";
  const repo = "life";

  /*
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/expenses/2026/04.csv`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
    },
  );

  if (!res.ok) return c.json({ error: "Failed to fetch CSV" }, 500);

  const csv = await res.text();

  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  const data = lines.slice(1).map((line: string) => {
    const values = line.split(",");
    return Object.fromEntries(
      headers.map((h: string, i: number) => [h, values[i]]),
    );
  });

  return c.json(data);
  */
});

export default app;
