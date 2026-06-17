import { json } from "../_lib/json"
import { normalizeNotionExpenses } from "../_lib/notion-normalize"
import { RequestContext } from "../_lib/types"

async function fetchNotionData(token: string, data_source_id: string) {
  const url = `https://api.notion.com/v1/data_sources/${data_source_id}/query`
  return await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2026-03-11",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
}

export async function onRequest(context: RequestContext) {
  const token = context.env.NOTION_API_TOKEN
  const data_source_id = context.env.DATA_SOURCE_ID_TRADE

  if (!token)
    return json({ error: "Missing Notion API Token" }, { status: 500 })
  if (!data_source_id)
    return json({ error: "Missing Notion Data Source ID" }, { status: 500 })

  const res = await fetchNotionData(token, data_source_id)

  const body = normalizeNotionExpenses(await res.json())

  return json(body)
}
