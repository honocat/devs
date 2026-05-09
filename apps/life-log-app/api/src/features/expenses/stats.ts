import { type Expense } from "./types";

// calendar
export function getDailyTotals(data: Expense[]) {
  const map: Record<string, number> = {};
  for (const row of data) {
    map[row.date] = (map[row.date] ?? 0) + row.amount;
  }
  return map;
}

// detail
export function getDetail(data: Expense[], day: string) {
  return data
    .filter((d) => d.date === day)
    .map(({ item, amount }) => ({
      item,
      amount,
    }));
}

// weekly
export function getWeeklyData(data: Expense[], day: string) {
  const base = new Date(day);
  base.setDate(base.getDate() - base.getDay());
  const labels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return labels.map((label, index) => {
    const current = new Date(base);
    current.setDate(base.getDate() + index);
    const key = current.toISOString().slice(0, 10);
    const total = data
      .filter((d) => d.date === key)
      .reduce((sum, d) => sum + d.amount, 0);
    return {
      day: label,
      amount: total,
    };
  });
}

// monthly
export function getMonthlyCumulative(
  data: Expense[],
  year: string,
  month: string,
) {
  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
  const map: Record<string, number> = {};
  for (const row of data) {
    map[row.date] = (map[row.date] ?? 0) + row.amount;
  }
  let running = 0;
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${month}-${String(day).padStart(2, "0")}`;
    running += map[date] ?? 0;
    return {
      day: String(day),
      total: running,
    };
  });
}
