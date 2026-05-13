import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns"

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

function getCalendarDateRange(year: string, month: string) {
  const base = new Date(Number(year), Number(month) - 1, 1)
  const start = startOfWeek(startOfMonth(base), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(base), { weekStartsOn: 0 })

  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  }
}

function filterExpensesByRange(data: Expense[], start: string, end: string) {
  return data.filter((row) => row.date >= start && row.date <= end)
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
  // const day = url.searchParams.get("day")

  // if (!year || !month || !day)
  if (!year || !month) return json({ error: "Invalid params" }, { status: 400 })

  try {
    const data = await fetchExpense(
      token,
      owner,
      repo,
      Number(year),
      Number(month)
    )
    const { start, end } = getCalendarDateRange(year, month)

    // return json({
    //   calendar: getDailyTotals(data, start, end),
    //   detail: getDetail(data, day),
    //   weekly: getWeeklyData(data, day),
    //   monthly: getMonthlyCumulative(data, year, month),
    // })
    return json(filterExpensesByRange(data, start, end))
  } catch (error) {
    console.error("failed to load expenses", error)
    return json({ error: "Failed to load expenses" }, { status: 500 })
  }
}
