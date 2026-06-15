import { json } from "../_lib/json"
import { RequestContext } from "../_lib/types"

export async function onRequest(context: RequestContext) {
  const token = context.env.NOTION_API_TOKEN
  const id = context.env.NOTION_DB_ID

  console.log("token", token)
  console.log("id", id)

  if (!token)
    return json({ error: "Missing Notion API Token" }, { status: 500 })
  if (!id) {
    return json({ error: "Missing Notion Database ID" }, { status: 500 })
  }

  const url = `https://api.notion.com/v1/data_sources/${id}/query`
  console.log("url", url)

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2026-03-11",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })

  const body = await response.json()
  return json(body)
}
