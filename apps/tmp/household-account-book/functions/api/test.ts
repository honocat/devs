import { json } from "../_lib/json"
import { RequestContext } from "../_lib/types"

export async function onRequest(context: RequestContext) {
  const token = context.env.NOTION_API_TOKEN
  const id = context.env.DATA_SOURCE_ID_JOURNAL

  const url = `https://api.notion.com/v1/data_sources/${id}/query`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2026-03-11",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })

  const body = await res.json()
  return json(body)
}
