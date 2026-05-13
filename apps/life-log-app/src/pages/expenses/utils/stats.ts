import { formatYear, formatMonth, formatDate } from '@/pages/expenses/utils/date'
import type { Expense, Weekly, Monthly } from '@/pages/expenses/utils/types'

export function getCalendarData(expenses: Expense[]) {
  const totals: Record<string, number> = {}
  for (const row of expenses) {
    totals[row.date] = (totals[row.date] ?? 0) + row.amount
  }
  return totals
}

export function getDetailData(expenses: Expense[], selected: Date) {
  const day = formatDate(selected)
  return expenses.filter((row) => row.date === day)
}

export function getWeeklyData(expenses: Expense[], selected: Date): Weekly[] {
  const base = new Date(selected)
  base.setDate(base.getDate() - base.getDay())

  const totals = new Map<string, number>()
  for (const row of expenses) {
    totals.set(row.date, (totals.get(row.date) ?? 0) + row.amount)
  }

  const days = ["日", "月", "火", "水", "木", "金", "土"]

  return days.map((day, index) => {
    const date = new Date(base)
    date.setDate(base.getDate() + index)
    const key = formatDate(date)

    return {
      day,
      amount: totals.get(key) ?? 0,
    }
  })
}

export function getMonthlyData(expenses: Expense[], currentMonth: Date): Monthly[] {
  const year = formatYear(currentMonth)
  const month = formatMonth(currentMonth)
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const totals = new Map<string, number>()
  for (const row of expenses) {
    totals.set(row.date, (totals.get(row.date) ?? 0) + row.amount)
  }

  let running = 0
  const result: Monthly[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${month}-${String(day).padStart(2, "0")}`
    running += totals.get(date) ?? 0

    result.push({
      day: String(day),
      total: running,
    })
  }

  return result
}