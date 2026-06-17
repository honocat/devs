type Env = {
  NOTION_API_TOKEN?: string
  DATA_SOURCE_ID_TRADE?: string
  DATA_SOURCE_ID_JOURNAL?: string
}

export type RequestContext = {
  request: Request
  env: Env
}

export type Transaction = {
  id: string // ページID
  date: string // YYYY-MM-DD形式
  time: string // HH:mm形式
  summary: string // 取引概要
  category: string // 勘定科目名（”食費”等）
  amount: number // 金額
}
