import { formatDateKey, getMonthDates, getWeekDates } from "@/components/utils/date"
import type {
  AccountCategory,
  DaySummary,
  JournalLine,
  MonthlyPoint,
  ViewMode,
  VisibleJournalLine,
  WeeklyPoint,
} from "@/components/utils/types"

type NotionFormula = {
  type: "formula"
  string?: string | null
  number?: number | null
  boolean?: boolean | null
}

type NotionTitle = {
  type: "title"
  title?: Array<{
    plain_text?: string
    text?: { content?: string }
  }>
}

type NotionSelect = {
  type: "select"
  select?: { name?: string | null } | null
}

type NotionDate = {
  type: "date"
  date?: { start?: string | null } | null
}

type NotionRollup = {
  type: "rollup"
  rollup?: {
    array?: Array<
      | NotionSelect
      | NotionDate
      | NotionFormula
      | { type: string; [key: string]: unknown }
    >
  }
}

type NotionNumber = {
  type: "number"
  number?: number | null
}

type NotionProperty =
  | NotionFormula
  | NotionTitle
  | NotionSelect
  | NotionDate
  | NotionRollup
  | NotionNumber
  | { type: string; [key: string]: unknown }

type NotionPage = {
  id: string
  url?: string
  properties?: Record<string, NotionProperty>
}

type NotionListResponse = {
  results?: NotionPage[]
}

const viewModeCategories: Record<ViewMode, AccountCategory[]> = {
  cashflow: ["費用", "収益"],
  "asset-move": ["資産"],
}

export function normalizeJournalLines(response: NotionListResponse): JournalLine[] {
  const results = response.results ?? []

  return results.flatMap((page) => {
    const props = page.properties ?? {}
    const dateTime = pickDateTime(props, ["取引日付", "取引日時", "日付"])
    const amount = pickNumber(props, ["金額", "取引金額"])
    const accountCategory = pickCategory(props, ["分類"])
    const side = pickSide(props, ["貸借区分"])
    const summary = pickText(props, ["仕訳帳用", "概要", "仕訳詳細"]) ?? ""
    const detail = pickText(props, ["仕訳詳細"]) ?? summary

    if (!dateTime || amount === null || side === null) return []

    return [
      {
        id: page.id,
        url: page.url ?? "",
        dateTime,
        dateKey: formatDateKey(new Date(dateTime)),
        summary,
        detail,
        accountCategory,
        side,
        amount,
      },
    ]
  })
}

export function getVisibleJournalLines(
  lines: JournalLine[],
  mode: ViewMode
): VisibleJournalLine[] {
  const allowed = new Set(viewModeCategories[mode])

  return lines
    .filter((line) => allowed.has(line.accountCategory))
    .map((line) => ({
      ...line,
      signedAmount: getSignedAmount(line, mode),
    }))
    .filter((line) => line.signedAmount !== 0)
}

export function getCalendarData(lines: VisibleJournalLine[]) {
  const buckets: Record<string, DaySummary> = {}

  for (const line of lines) {
    const bucket = buckets[line.dateKey] ?? {
      dateKey: line.dateKey,
      count: 0,
      positiveTotal: 0,
      negativeTotal: 0,
      total: 0,
    }

    bucket.count += 1
    bucket.total += line.signedAmount

    if (line.signedAmount >= 0) {
      bucket.positiveTotal += line.signedAmount
    } else {
      bucket.negativeTotal += line.signedAmount
    }

    buckets[line.dateKey] = bucket
  }

  return buckets
}

export function getDetailData(lines: VisibleJournalLine[], selected: Date) {
  const day = formatDateKey(selected)
  return lines.filter((line) => line.dateKey === day)
}

export function getWeeklyData(
  lines: VisibleJournalLine[],
  selected: Date
): WeeklyPoint[] {
  const weekDates = getWeekDates(selected)
  const totals = new Map<
    string,
    { positive: number; negative: number; total: number }
  >()

  for (const line of lines) {
    const current = totals.get(line.dateKey) ?? {
      positive: 0,
      negative: 0,
      total: 0,
    }

    current.total += line.signedAmount

    if (line.signedAmount >= 0) {
      current.positive += line.signedAmount
    } else {
      current.negative += line.signedAmount
    }

    totals.set(line.dateKey, current)
  }

  const days = ["日", "月", "火", "水", "木", "金", "土"]

  return weekDates.map((date) => {
    const key = formatDateKey(date)
    const bucket = totals.get(key)

    return {
      dateKey: key,
      dayLabel: days[date.getDay()],
      total: bucket?.total ?? 0,
      positiveTotal: bucket?.positive ?? 0,
      negativeTotal: bucket?.negative ?? 0,
    }
  })
}

export function getMonthlyData(
  lines: VisibleJournalLine[],
  currentMonth: Date
): MonthlyPoint[] {
  const monthDates = getMonthDates(currentMonth)
  const totals = new Map<
    string,
    { positive: number; negative: number; total: number }
  >()

  for (const line of lines) {
    const current = totals.get(line.dateKey) ?? {
      positive: 0,
      negative: 0,
      total: 0,
    }

    current.total += line.signedAmount

    if (line.signedAmount >= 0) {
      current.positive += line.signedAmount
    } else {
      current.negative += line.signedAmount
    }

    totals.set(line.dateKey, current)
  }

  let cumulative = 0

  return monthDates.map((date) => {
    const key = formatDateKey(date)
    const bucket = totals.get(key)
    const dailyTotal = bucket?.total ?? 0
    cumulative += dailyTotal

    return {
      dateKey: key,
      day: date.getDate(),
      dailyTotal,
      cumulativeTotal: cumulative,
      positiveTotal: bucket?.positive ?? 0,
      negativeTotal: bucket?.negative ?? 0,
    }
  })
}

export function formatYen(amount: number) {
  return new Intl.NumberFormat("ja-JP").format(Math.abs(Math.round(amount)))
}

export function formatSignedYen(amount: number) {
  const sign = amount < 0 ? "-" : ""
  return `${sign}¥${formatYen(amount)}`
}

function getSignedAmount(line: JournalLine, mode: ViewMode) {
  if (mode === "cashflow") {
    if (line.accountCategory === "収益") {
      return line.side === "貸方" ? line.amount : -line.amount
    }

    if (line.accountCategory === "費用") {
      return line.side === "借方" ? -line.amount : line.amount
    }
  }

  if (mode === "asset-move") {
    if (line.accountCategory === "資産") {
      return line.side === "借方" ? line.amount : -line.amount
    }
  }

  return 0
}

function pickDateTime(props: Record<string, NotionProperty>, keywords: string[]) {
  for (const [name, prop] of Object.entries(props)) {
    if (!keywords.some((keyword) => name.includes(keyword))) continue

    const direct = extractDateTime(prop)
    if (direct) return direct

    if (prop.type === "rollup") {
      const array = (prop as NotionRollup).rollup?.array ?? []
      for (const item of array) {
        const nested = extractDateTime(item)
        if (nested) return nested
      }
    }
  }

  return null
}

function pickNumber(props: Record<string, NotionProperty>, keywords: string[]) {
  for (const [name, prop] of Object.entries(props)) {
    if (!keywords.some((keyword) => name.includes(keyword))) continue

    const value = extractNumber(prop)
    if (value !== null) return value
  }

  return null
}

function pickSide(props: Record<string, NotionProperty>, keywords: string[]) {
  for (const [name, prop] of Object.entries(props)) {
    if (!keywords.some((keyword) => name.includes(keyword))) continue

    const value = extractSelectName(prop)
    if (value === "借方" || value === "貸方") return value
  }

  return null
}

function pickCategory(props: Record<string, NotionProperty>, keywords: string[]) {
  for (const [name, prop] of Object.entries(props)) {
    if (!keywords.some((keyword) => name.includes(keyword))) continue

    const value = extractCategory(prop)
    if (value) return value
  }

  return "unknown"
}

function pickText(props: Record<string, NotionProperty>, keywords: string[]) {
  for (const [name, prop] of Object.entries(props)) {
    if (!keywords.some((keyword) => name.includes(keyword))) continue

    const value = extractText(prop)
    if (value) return value
  }

  return null
}

function extractDateTime(prop: NotionProperty) {
  if (prop.type === "date") {
    const dateProp = prop as NotionDate
    return dateProp.date?.start ?? null
  }

  if (prop.type === "rollup") {
    const nested = (prop as NotionRollup).rollup?.array?.[0]
    if (nested && "type" in nested) return extractDateTime(nested as NotionProperty)
  }

  return null
}

function extractNumber(prop: NotionProperty) {
  if (prop.type === "number") {
    const numberProp = prop as NotionNumber
    return typeof numberProp.number === "number" ? numberProp.number : null
  }

  if (prop.type === "formula") {
    const formulaProp = prop as NotionFormula
    if (typeof formulaProp.number === "number") return formulaProp.number
  }

  if (prop.type === "rollup") {
    const nested = (prop as NotionRollup).rollup?.array?.[0]
    if (nested && "type" in nested) return extractNumber(nested as NotionProperty)
  }

  return null
}

function extractSelectName(prop: NotionProperty) {
  if (prop.type === "select") {
    const selectProp = prop as NotionSelect
    return selectProp.select?.name ?? null
  }

  if (prop.type === "rollup") {
    const nested = (prop as NotionRollup).rollup?.array?.[0]
    if (nested && "type" in nested) return extractSelectName(nested as NotionProperty)
  }

  return null
}

function extractCategory(prop: NotionProperty): AccountCategory | null {
  const value = extractSelectName(prop)
  if (
    value === "資産" ||
    value === "負債" ||
    value === "費用" ||
    value === "収益" ||
    value === "純資産"
  ) {
    return value
  }

  return null
}

function extractText(prop: NotionProperty) {
  if (prop.type === "formula") {
    const formulaProp = prop as NotionFormula
    if (typeof formulaProp.string === "string") {
      return formulaProp.string.trim()
    }
  }

  if (prop.type === "title") {
    const title = (prop as NotionTitle).title ?? []
    return title
      .map((item) => item.plain_text ?? item.text?.content ?? "")
      .join("")
      .trim()
  }

  if (prop.type === "select") {
    const selectProp = prop as NotionSelect
    return selectProp.select?.name?.trim() ?? ""
  }

  if (prop.type === "rollup") {
    const nested = (prop as NotionRollup).rollup?.array?.[0]
    if (nested && "type" in nested) return extractText(nested as NotionProperty)
  }

  return ""
}
