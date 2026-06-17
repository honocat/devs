export type ViewMode = "cashflow" | "asset-move"

export type AccountingSide = "借方" | "貸方"

export type AccountCategory =
  | "資産"
  | "負債"
  | "費用"
  | "収益"
  | "純資産"
  | "unknown"

export type JournalLine = {
  id: string
  url: string
  dateTime: string
  dateKey: string
  summary: string
  detail: string
  accountCategory: AccountCategory
  side: AccountingSide
  amount: number
}

export type VisibleJournalLine = JournalLine & {
  signedAmount: number
}

export type DaySummary = {
  dateKey: string
  count: number
  positiveTotal: number
  negativeTotal: number
  total: number
}

export type WeeklyPoint = {
  dateKey: string
  dayLabel: string
  total: number
  positiveTotal: number
  negativeTotal: number
}

export type MonthlyPoint = {
  dateKey: string
  day: number
  dailyTotal: number
  cumulativeTotal: number
  positiveTotal: number
  negativeTotal: number
}
