export type Expense = {
  item: string
  amount: number
  date: string
}
export type Weekly = {
  day: string
  amount: number
}
export type Monthly = {
  day: string
  total: number
}

export type ExpenseApiRes = {
  calendar: Record<string, number>
  detail: Expense[]
  weekly: Weekly[]
  monthly: Monthly[]
}
