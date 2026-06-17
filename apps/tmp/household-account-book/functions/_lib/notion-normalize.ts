import {
  NotionListResponse,
  NormalizeOptions,
  NormalizedExpense,
  NotionDateProperty,
  NotionNumberProperty,
  NotionTitleProperty,
} from "../_lib/types"

const DEFAULT_PROPERTY_NAMES = {
  date: "取引日時",
  amount: "取引金額",
  summary: "概要",
} as const

export function normalizeNotionExpenses(
  response: NotionListResponse,
  options: NormalizeOptions = {}
): NormalizedExpense[] {
  const timeZone = options.timeZone ?? "Asia/Tokyo"
  const propertyNames = {
    ...DEFAULT_PROPERTY_NAMES,
    ...options.propertyNames,
  }

  if (!response?.results?.length) return []

  return response.results.flatMap((page) => {
    const props = page.properties ?? {}

    const dateProp = props[propertyNames.date]
    const amountProp = props[propertyNames.amount]
    const summaryProp = props[propertyNames.summary]

    const start = getNotionDateStart(dateProp)
    const amount = getNotionNumber(amountProp)
    const summary = getNotionTitle(summaryProp)

    if (!start || amount === null) return []

    return [
      {
        id: page.id,
        dateTime: start,
        dateKey: toDateKey(start, timeZone),
        amount,
        summary,
        url: page.url ?? "",
      },
    ]
  })
}

function getNotionDateStart(prop: unknown): string | null {
  const dateProp = prop as NotionDateProperty | undefined
  return dateProp?.type === "date" ? (dateProp.date?.start ?? null) : null
}

function getNotionNumber(prop: unknown): number | null {
  const numberProp = prop as NotionNumberProperty | undefined
  if (numberProp?.type !== "number") return null
  return typeof numberProp?.number === "number" ? numberProp.number : null
}

function getNotionTitle(prop: unknown): string {
  const titleProp = prop as NotionTitleProperty | undefined
  if (titleProp?.type !== "title") return ""

  const text = titleProp.title
    ?.map((item) => item.plain_text ?? item.text?.content ?? "")
    .join("")
  return text?.trim() || ""
}

function toDateKey(isoString: string, timeZone: string): string {
  const date = new Date(isoString)

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const year = parts.find((p) => p.type === "year")?.value ?? "0000"
  const month = parts.find((p) => p.type === "month")?.value ?? "00"
  const day = parts.find((p) => p.type === "day")?.value ?? "00"

  return `${year}-${month}-${day}`
}
