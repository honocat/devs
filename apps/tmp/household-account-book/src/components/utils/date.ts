import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns"

const weekStartsOn = 0 as const

export function formatDateKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function formatMonthLabel(date: Date) {
  return format(date, "yyyy年M月")
}

export function formatDayLabel(date: Date) {
  return format(date, "M/d")
}

export function getWeekDates(date: Date) {
  const first = startOfWeek(date, { weekStartsOn })
  return Array.from({ length: 7 }, (_, index) => addDays(first, index))
}

export function getMonthDates(date: Date) {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  })
}

export function toDateKey(dateTime: string) {
  return formatDateKey(new Date(dateTime))
}
