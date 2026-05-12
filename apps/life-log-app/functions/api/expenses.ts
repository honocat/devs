import { fetchRepoFile } from "../_lib/github"
import { json } from "../_lib/json"
import { parseCSV } from "../_lib/parser"
import type { RequestContext } from "../_lib/types"

export type Expense = {
  item: string
  amount: number
  date: string
}

// 3 months
function getTargetMonths(year: number, month: number) {
  const base = new Date(year, month - 1)

  const prev = new Date(base)
  prev.setMonth(prev.getMonth() - 1)
  const next = new Date(base)
  next.setMonth(next.getMonth() + 1)

  const format = (d: Date) => ({
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
  })

  return [format(prev), format(base), format(next)]
}

// calendar
function getDailyTotals(data: Expense[]) {
  const map: Record<string, number> = {}
  for (const row of data) map[row.date] = (map[row.date] ?? 0) + row.amount
  return map
}
// detail
function getDetail(data: Expense[], day: string) {
  return data
    .filter((d) => d.date === day)
    .map(({ item, amount }) => ({ item, amount }))
}
// weekly
function getWeeklyData(data: Expense[], day: string) {
  const base = new Date(day)
  base.setDate(base.getDate() - base.getDay())

  const days = ["日", "月", "火", "水", "木", "金", "土"]
  const map = new Map<string, number>()
  for (const d of days) map.set(d, 0)

  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    const total = data
      .filter((row) => row.date === key)
      .reduce((sum, row) => sum + row.amount, 0)
    map.set(days[i], total)
  }

  return days.map((d) => ({
    day: d,
    amount: map.get(d) ?? 0,
  }))
}
// monthly
function getMonthlyCumulative(data: Expense[], year: string, month: string) {
  const daysInMonth = new Date(Number(year), Number(month), 0).getDate()
  const map: Record<string, number> = {}
  for (const row of data) map[row.date] = (map[row.date] ?? 0) + row.amount

  let running = 0
  const result = []

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${month}-${String(d).padStart(2, "0")}`
    running += map[date] ?? 0
    result.push({
      day: String(d),
      total: running,
    })
  }

  return result
}

// fetch data
async function fetchExpense(
  token: string,
  owner: string,
  repo: string,
  year: number,
  month: number
) {
  const targets = getTargetMonths(year, month)
  const all = []
  for (const t of targets) {
    const data = await fetchRepoFile(
      token,
      owner,
      repo,
      `expenses/${t.year}/${t.month}.csv`
    )
    if (!data) continue
    all.push(...parseCSV(data))
  }
  return all
}

export async function onRequest(context: RequestContext) {
  const token = context.env.GITHUB_API_TOKEN
  const owner = context.env.OWNER
  const repo = context.env.REPO

  if (!token)
    return json({ error: "Missing GitHub API Token" }, { status: 500 })
  if (!owner || !repo) {
    return json(
      { error: "Missing GitHub repository settings" },
      { status: 500 }
    )
  }

  const url = new URL(context.request.url)
  const year = url.searchParams.get("year")
  const month = url.searchParams.get("month")
  const day = url.searchParams.get("day")

  if (!year || !month || !day)
    return json({ error: "Invalid params" }, { status: 400 })

  try {
    const data = await fetchExpense(
      token,
      owner,
      repo,
      Number(year),
      Number(month)
    )

    return json({
      calendar: getDailyTotals(data),
      detail: getDetail(data, day),
      weekly: getWeeklyData(data, day),
      monthly: getMonthlyCumulative(data, year, month),
    })
  } catch (error) {
    console.error("failed to load expenses", error)
    return json({ error: "Failed to load expenses" }, { status: 500 })
  }
}
