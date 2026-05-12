import { useEffect, useMemo, useState } from "react"

import { endOfWeek, startOfWeek } from "date-fns"
import { type DateRange } from "react-day-picker"

import ExpenseCalendar from "@/pages/expenses/components/ExpenseCalendar"
import ExpenseDetail from "@/pages/expenses/components/ExpenseDetail"
import WeeklyChart from "@/pages/expenses/components/WeeklyChart"
import MonthlyChart from "@/pages/expenses/components/MonthlyChart"

import {
  formatYear,
  formatMonth,
  formatDate,
} from "@/pages/expenses/utils/date"
import type { ExpenseApiRes } from "@/pages/expenses/utils/types"

import { Container } from "@/components/layouts/Container"

function getWeekRange(date: Date): DateRange {
  return {
    from: startOfWeek(date, { weekStartsOn: 0 }),
    to: endOfWeek(date, { weekStartsOn: 0 }),
  }
}

async function fetchDate(year: string, month: string, day: string) {
  const reqUrl = `/api/expenses?year=${year}&month=${month}&day=${day}`

  const res = await fetch(`${reqUrl}`)
  if (!res.ok) throw new Error(`Failed to load expense: ${res.status}`)
  return (await res.json()) as ExpenseApiRes
}

export default function ExpensesPage() {
  const [selected, setSelected] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const range = useMemo(() => getWeekRange(selected), [selected])

  const [data, setData] = useState<ExpenseApiRes | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const year = formatYear(selected)
        const month = formatMonth(currentMonth)
        const day = formatDate(selected)

        const res = await fetchDate(year, month, day)
        setData(res)
      } catch (e) {
        setError(`Error occured: ${e}`)
      }
    }

    run()
  }, [selected, currentMonth])

  const weeklyMax = useMemo(() => {
    if (!data) return 0
    return Math.max(...data.weekly.map((d) => d.amount), 0)
  }, [data])

  const monthlyMax = useMemo(() => {
    if (!data) return 0
    return Math.max(...data.monthly.map((d) => d.total), 0)
  }, [data])

  if (error || !data) return <div className="p-4">{error}</div>

  return (
    <Container>
      <ExpenseCalendar
        selected={selected}
        currentMonth={currentMonth}
        range={range}
        data={data.calendar}
        onSelect={(d) => setSelected(d)}
        onMonthChange={(m) => setCurrentMonth(m)}
      />
      <WeeklyChart data={data.weekly} max={weeklyMax} />
      <ExpenseDetail selected={selected} data={data.detail} />
      <MonthlyChart data={data.monthly} max={monthlyMax} month={currentMonth} />
    </Container>
  )
}
