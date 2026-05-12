import { format } from "date-fns"

export function formatYear(date: Date) {
  return format(date, "yyyy")
}
export function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd")
}
export function formatMonth(date: Date) {
  return format(date, "MM")
}
