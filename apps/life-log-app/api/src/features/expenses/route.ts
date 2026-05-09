import { Hono } from "hono";

import type { Bindings } from "../../index";

import { fetchExpenses } from "./service";

import {
  getDailyTotals,
  getDetail,
  getWeeklyData,
  getMonthlyCumulative,
} from "./stats";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const { GITHUB_API_TOKEN, OWNER, REPO } = c.env;

  const year = c.req.query("year");
  const month = c.req.query("month");
  const day = c.req.query("day");

  if (!year || !month || !day) {
    return c.json({ error: "Invalid params" }, 400);
  }

  const data = await fetchExpenses(
    GITHUB_API_TOKEN,
    OWNER,
    REPO,
    Number(year),
    Number(month),
  );

  return c.json({
    calendar: getDailyTotals(data),
    detail: getDetail(data, day),
    weekly: getWeeklyData(data, day),
    monthly: getMonthlyCumulative(data, year, month),
  });
});

export default app;
