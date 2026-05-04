import { format } from "date-fns"

export type Expense = {
  item: string
  amount: number
  date: string
}

export function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd")
}
export function formatYear(date: Date) {
  return format(date, "yyyy")
}
export function formatMonth(date: Date) {
  return format(date, "MM")
}
