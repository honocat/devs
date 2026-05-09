import { Hono } from "hono";
import { cors } from "hono/cors";

import wordsRoute from "./features/words/route";
import expensesRoute from "./features/expenses/route";

export type Bindings = {
  GITHUB_API_TOKEN: string;
  OWNER: string;
  REPO: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: ["https://devs-2kv.pages.dev", "*"],
    allowMethods: ["GET"],
    allowHeaders: ["Content-Type"],
  }),
);

app.route("/words", wordsRoute);
app.route("/expenses", expensesRoute);

export default app;
