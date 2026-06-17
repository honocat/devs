export type Transaction = {
  id: string // ページID
  date: string // YYYY-MM-DD形式
  time: string // HH:mm形式
  summary: string // 取引概要
  category: string // 勘定科目名（”食費”等）
  amount: number // 金額
}
export type Weekly = {
  day: string
  amount: number
}
export type Monthly = {
  day: string
  total: number
}
