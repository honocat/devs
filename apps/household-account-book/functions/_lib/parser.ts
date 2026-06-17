import type { Transaction } from "./types"

type NotionListResponse = {
  object?: "list"
  results: NotionPage[]
}

type NotionPage = {
  object?: "page"
  id: string
  created_time?: string
  properties: Record<string, NotionProperty>
}

type NotionProperty =
  | {
      type?: "title"
      title?: RichText[]
    }
  | {
      type?: "formula"
      // number?: number | null
      formula?: {
        number?: number | null
      }
    }
  | {
      type?: "select"
      select?: {
        name?: string | null
      } | null
    }
  | {
      type?: "rollup"
      rollup?: {
        array?: Array<
          | {
              type?: "date"
              date?: {
                start?: string | null
              } | null
            }
          | {
              type?: "select"
              select?: {
                name?: string | null
              } | null
            }
        > | null
      } | null
    }

type RichText =
  | {
      type?: "mention"
      plain_text?: string
      mention?: {
        type?: "page"
        page?: {
          id?: string
        } | null
      } | null
    }
  | {
      type?: "text"
      plain_text?: string
      text?: {
        content?: string
      } | null
    }

export function parseTransactions(payload: NotionListResponse): Transaction[] {
  return payload.results.map(parseTransaction)
}

export function parseTransaction(page: NotionPage): Transaction {
  const props = page.properties
  const detail = props["仕訳詳細"]
  const dateProperty = props["取引日付（取引DB）"]
  const amountProperty = props["増減"]

  const titleParts = getRichText(detail)
  const mentions = titleParts
    .filter((part): part is Extract<RichText, { type?: "mention" }> => part.type === "mention")
    .map((part) => part.plain_text?.trim() ?? "")
    .filter(Boolean)

  const summary = mentions[0] ?? ""
  const category = mentions[1] ?? ""
  const amountText = titleParts.at(-1)?.plain_text ?? ""

  const dateStart =
    getRollupDateStart(dateProperty) ??
    page.created_time ??
    new Date().toISOString()
  const { date, time } = formatDateTime(dateStart)

  const amount =
    getNumberFromFormula(amountProperty) ??
    parseAmount(amountText) ??
    0

  return {
    id: page.id,
    date,
    time,
    summary,
    category,
    amount,
  }
}

function getRichText(property: NotionProperty | undefined): RichText[] {
  if (!property || property.type !== "title" || !Array.isArray(property.title)) {
    return []
  }

  return property.title
}

function getNumberFromFormula(property: NotionProperty | undefined): number | undefined {
  if (!property || property.type !== "formula" || !property.formula?.number) return undefined
  return typeof property.formula.number === "number" ? property.formula.number : undefined
}

function getRollupDateStart(property: NotionProperty | undefined): string | undefined {
  if (!property || property.type !== "rollup") return undefined

  const item = property.rollup?.array?.[0]
  if (!item || item.type !== "date") return undefined

  return item.date?.start ?? undefined
}

function parseAmount(value: string): number | undefined {
  const normalized = value.trim().replace(/,/g, "")
  if (!/^[-+]?\d+(\.\d+)?$/.test(normalized)) return undefined

  const amount = Number(normalized)
  return Number.isFinite(amount) ? amount : undefined
}

function formatDateTime(iso: string): { date: string; time: string } {
  const dateTime = new Date(iso)

  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(dateTime)

  const timeParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(dateTime)

  const year = partValue(dateParts, "year")
  const month = partValue(dateParts, "month")
  const day = partValue(dateParts, "day")
  const hour = partValue(timeParts, "hour")
  const minute = partValue(timeParts, "minute")

  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
  }
}

function partValue(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? ""
}
