type Env = {
  NOTION_API_TOKEN?: string
  DATA_SOURCE_ID_TRADE?: string
  DATA_SOURCE_ID_JOURNAL?: string
}

export type RequestContext = {
  request: Request
  env: Env
}

// Notion
type NotionText = {
  plain_text?: string
  text?: { content?: string }
}

export type NotionDateProperty = {
  type: "date"
  date?: {
    start?: string
    end?: string | null
    time_zone?: string | null
  } | null
}

export type NotionNumberProperty = {
  type: "number"
  number?: number | null
}

export type NotionTitleProperty = {
  type: "title"
  title?: NotionText[]
}

type NotionPageProperty =
  | NotionDateProperty
  | NotionNumberProperty
  | NotionTitleProperty
  | { type: string; [key: string]: unknown }

type NotionPage = {
    object: "page"
    id: string
    url?: string
    properties?: Record<string, NotionPageProperty>
}

export type NotionListResponse = {
    object: "list"
    results: NotionPage[]
}

export type NormalizedExpense = {
    id: string
    dateTime: string
    dateKey: string
    amount: number
    summary: string
    url: string
}

export type NormalizeOptions = {
    timeZone?: string
    propertyNames?: {
        date?: string
        amount?: string
        summary?: string
    }
}