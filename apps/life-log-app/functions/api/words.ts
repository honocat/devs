import { fetchRepoDir } from "../_lib/github"
import { json } from "../_lib/json"
import { parseWord } from "../_lib/parser"
import { type RequestContext } from "../_lib/types"

export async function fetchWords(token: string, owner: string, repo: string) {
  const files = await fetchRepoDir(token, owner, repo, "words/data")
  const mdFiles = files.filter((f: any) => f.name.endsWith(".md"))

  return Promise.all(
    mdFiles.map(async (file: any) => {
      const text = await fetch(file.download_url).then((r) => r.text())
      return parseWord(text, file.name)
    })
  )
}

export async function onRequest(context: RequestContext) {
  const token = context.env.GITHUB_API_TOKEN
  const owner = context.env.OWNER
  const repo = context.env.REPO

  if (!token)
    return json({ error: "Missing GitHub API Token" }, { status: 500 })
  if (!owner || !repo) {
    return json(
      { error: "Missing GitHub repository settings" },
      { status: 500 }
    )
  }

  try {
    const words = await fetchWords(token, owner, repo)
    return json(words)
  } catch (error) {
    console.error("failed to load words", error)
    return json({ error: "Failed to load words" }, { status: 500 })
  }
}
