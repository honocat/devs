import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  GITHUB_API_TOKEN: string;
  OWNER: string;
  REPO: string;
};
type Expense = {
  item: string;
  amount: number;
  date: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: "https://honocat.github.io",
    allowMethods: ["GET"],
    allowHeaders: ["Content-Type"],
  }),
);

function parseCSV(csvText: string) {
  const trimmed = csvText.trim();
  if (!trimmed) return [];

  const lines = trimmed.split("\n");
  return lines.slice(1).flatMap((line) => {
    if (!line.trim()) return [];
    const [item, amount, date] = line.split(",");
    if (!item || !amount || !date) return [];
    return [{ item, amount: Number(amount), date }];
  });
}

function getTargetMonths(year: number, month: number) {
  const base = new Date(year, month - 1);

  const prev = new Date(base);
  prev.setMonth(prev.getMonth() - 1);
  const next = new Date(base);
  next.setMonth(next.getMonth() + 1);

  const format = (d: Date) => ({
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
  });

  return [format(prev), format(base), format(next)];
}

// 1. Calendar
function getDailyTotals(data: Expense[]) {
  const map: Record<string, number> = {};
  for (const row of data) map[row.date] = (map[row.date] ?? 0) + row.amount;
  return map;
}
// 2. Detail
function getDetail(data: Expense[], day: string) {
  return data
    .filter((d) => d.date === day)
    .map(({ item, amount }) => ({ item, amount }));
}
// 3. Weekly
function getWeekData(data: Expense[], day: string) {
  const base = new Date(day);
  base.setDate(base.getDate() - base.getDay());

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const map = new Map<string, number>();
  for (const d of days) map.set(d, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const total = data
      .filter((d) => d.date === key)
      .reduce((sum, d) => sum + d.amount, 0);
    map.set(days[i], total);
  }
  return days.map((d) => ({
    day: d,
    amount: map.get(d) ?? 0,
  }));
}
// 4. monthly
function getMonthlyCumulative(data: Expense[], year: string, month: string) {
  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
  const map: Record<string, number> = {};
  for (const row of data) map[row.date] = (map[row.date] ?? 0) + row.amount;

  let running = 0;
  const result = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${month}-${String(d).padStart(2, "0")}`;
    running += map[date] ?? 0;
    result.push({
      day: String(d),
      total: running,
    });
  }
  return result;
}

// fetch month
async function fetchMonth(
  token: string,
  owner: string,
  repo: string,
  year: string,
  month: string,
) {
  const rootDir = "expenses";

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${rootDir}/${year}/${month}.csv`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3.raw",
      "User-Agent": "expense-web",
    },
  });

  if (res.status === 404) return [];
  if (!res.ok) throw new Error("fetch failed");

  return parseCSV(await res.text());
}
// fetch data
async function fetchData(
  token: string,
  owner: string,
  repo: string,
  year: number,
  month: number,
) {
  const targets = getTargetMonths(year, month);
  const all: Expense[] = [];
  for (const t of targets) {
    const data = await fetchMonth(token, owner, repo, t.year, t.month);
    all.push(...data);
  }
  return all;
}

app.get("/expenses", async (c) => {
  const token = c.env.GITHUB_API_TOKEN;
  const owner = c.env.OWNER;
  const repo = c.env.REPO;
  if (!token) return c.json({ error: "Missing GitHub API Token" }, 500);

  const year = c.req.query("year");
  const month = c.req.query("month");
  const day = c.req.query("day");
  if (!year || !month || !day) return c.json({ error: "Invalid params" }, 400);

  const data = await fetchData(token, owner, repo, Number(year), Number(month));

  return c.json({
    calendar: getDailyTotals(data),
    detail: getDetail(data, day),
    weekly: getWeekData(data, day),
    monthly: getMonthlyCumulative(data, year, month),
  });
});

export default app;
