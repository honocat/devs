import { lazy, useEffect, useMemo, useState } from "react"

import { endOfWeek, startOfWeek } from "date-fns"
import { type DateRange } from "react-day-picker"

import ExpenseCalendar from "@/components/features/ExpenseCalendar"
import ExpenseDetail from "@/components/features/ExpenseDetail"
const WeeklyChart = lazy(() => import("@/components/features/WeeklyChart"))
const MonthlyChart = lazy(() => import("@/components/features/MonthlyChart"))

import Selection from "@/components/features/Selection"

import { getMonthKey } from "@/components/utils/date"
import {
  getCalendarData,
  getDetailData,
  getWeeklyData,
  getMonthlyData,
} from "@/components/utils/stats"
import type { Transaction } from "@/components/utils/types"

import { Container } from "@/components/layouts/Container"

import { ErrorMessage } from "@/lib/error"
import { Spinner } from "@/lib/spinner"

const expenseCache = new Map<string, Promise<Transaction[]> | Transaction[]>()

function getWeekRange(date: Date): DateRange {
  return {
    from: startOfWeek(date, { weekStartsOn: 0 }),
    to: endOfWeek(date, { weekStartsOn: 0 }),
  }
}

async function fetchData(select: string) {
  // const year = formatYear(month)
  // const mm = formatMonth(month)
  const reqUrl = `/api/expenses?select=${select}`

  const res = await fetch(`${reqUrl}`)
  if (!res.ok) throw new Error(`Failed to load expense: ${res.status}`)
  return (await res.json()) as Transaction[]
}

async function fetchDataWithCache(month: Date, selection: string) {
  const monthKey = getMonthKey(month)
  const key = monthKey + selection
  const cached = expenseCache.get(key)

  if (cached) {
    if (Array.isArray(cached)) return cached
    return cached
  }

  const pending = fetchData(selection)
    .then((res) => {
      expenseCache.set(key, res)
      return res
    })
    .catch((error) => {
      expenseCache.delete(key)
      throw error
    })

  expenseCache.set(key, pending)
  return pending
}

export default function ExpensesPage() {
  const [selection, setSelection] = useState("費用")

  const [selected, setSelected] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const range = useMemo(() => getWeekRange(selected), [selected])

  const [expenses, setExpenses] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const key = getMonthKey(currentMonth)
      const cached = expenseCache.get(key)

      setError(null)

      if (cached && Array.isArray(cached)) {
        if (cancelled) return
        setExpenses(cached)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const res = await fetchDataWithCache(currentMonth, selection)
        if (cancelled) return
        setExpenses(res)
      } catch (e) {
        if (cancelled) return
        const message = e instanceof Error ? e.message : String(e)
        setError(`Error occured: ${message}`)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [currentMonth, selection])

  const calendarData = useMemo(() => getCalendarData(expenses), [expenses])
  const detailData = useMemo(
    () => getDetailData(expenses, selected),
    [expenses, selected]
  )
  const weeklyData = useMemo(
    () => getWeeklyData(expenses, selected),
    [expenses, selected]
  )
  const monthlyData = useMemo(
    () => getMonthlyData(expenses, currentMonth),
    [expenses, currentMonth]
  )

  const weeklyMax = useMemo(() => {
    return Math.max(...weeklyData.map((d) => d.amount), 0)
  }, [weeklyData])
  const monthlyMax = useMemo(() => {
    return Math.max(...monthlyData.map((d) => d.total), 0)
  }, [monthlyData])

  return (
    <Container>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <>
          <Selection selection={selection} setSelection={setSelection} />
          <ExpenseCalendar
            selected={selected}
            currentMonth={currentMonth}
            range={range}
            data={calendarData}
            onSelect={(d) => setSelected(d)}
            onMonthChange={(m) => setCurrentMonth(m)}
          />

          <WeeklyChart
            data={weeklyData}
            max={weeklyMax}
            selection={selection}
            range={range}
          />
          <ExpenseDetail
            selected={selected}
            data={detailData}
            selection={selection}
          />
          <MonthlyChart
            data={monthlyData}
            max={monthlyMax}
            month={currentMonth}
            selection={selection}
          />
        </>
      )}
    </Container>
  )
}
