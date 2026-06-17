import { json } from "../_lib/json"
import { parseTransactions } from "../_lib/parser"
import type { RequestContext } from "../_lib/types"

async function fetchExpenses(token: string, id: string, select: string) {
  const url = `https://api.notion.com/v1/data_sources/${id}/query`
  return await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2026-03-11",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: {
        property: "分類（勘定科目DB）",
        rollup: {
          any: {
            select: {
              equals: select,
            },
          },
        },
      },
    }),
  })
}

export async function onRequest(context: RequestContext) {
  const token = context.env.NOTION_API_TOKEN
  const id = context.env.DATA_SOURCE_ID_JOURNAL

  if (!token)
    return json({ error: "Missing Notion API Token." }, { status: 500 })
  if (!id)
    return json({ error: "Missing Notion Datasource ID" }, { status: 500 })

  const url = new URL(context.request.url)
  const select = url.searchParams.get("select")

  if (!select) return json({ error: "Invalid params" }, { status: 400 })

  const res = await fetchExpenses(token, id, select)
  const body = await res.json()
  const expenses = parseTransactions(body)
  return json(expenses)
}
