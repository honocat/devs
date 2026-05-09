import { Hono } from "hono";
import type { Bindings } from "../../index";
import { fetchWords } from "./service";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const { GITHUB_API_TOKEN, OWNER, REPO } = c.env;
  const words = await fetchWords(GITHUB_API_TOKEN, OWNER, REPO);
  return c.json(words);
});

export default app;
