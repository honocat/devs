import { useEffect, useMemo, useState } from "react"
import { endOfWeek, startOfWeek } from "date-fns"
import { type DateRange } from "react-day-picker"

import ExpenseCalendar from "@/components/features/ExpenseCalendar"
import ExpenseDetail from "@/components/features/ExpenseDetail"
import WeeklyChart, { type Weekly } from "@/components/features/Weekly"
import MonthlyChart, { type Monthly } from "./components/features/MonthlyChart"

import {
  formatYear,
  formatMonth,
  formatDate,
  type Expense,
} from "@/lib/expense"

type ExpenseApiRes = {
  calendar: Record<string, number>
  detail: Expense[]
  weekly: Weekly[]
  monthly: Monthly[]
}

function getWeekRange(date: Date): DateRange {
  return {
    from: startOfWeek(date, { weekStartsOn: 0 }),
    to: endOfWeek(date, { weekStartsOn: 0 }),
  }
}

async function fetchData(year: string, month: string, day: string) {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    console.log(baseUrl.slice(0, 5))
    throw new Error("API_URL is not defined")
  }
  const reqUrl = `${baseUrl}/expenses?year=${year}&month=${month}&day=${day}`

  const res = await fetch(`${reqUrl}`)
  if (!res.ok) throw new Error(`Failed to load expense: ${res.status}`)
  return (await res.json()) as ExpenseApiRes
}

export default function App() {
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
        const res = await fetchData(year, month, day)
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
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-4 sm:px-6">
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
    </div>
  )
}
