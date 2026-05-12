export async function githubFetch(
  token: string,
  url: string,
  accept = "application/vnd.github.v3+json"
) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: accept,
      "User-Agent": "life-log-app",
    },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`)
  return res
}

export async function fetchRepoDir(
  token: string,
  owner: string,
  repo: string,
  path: string
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const res = await githubFetch(token, url)
  if (!res) return []
  return await res.json()
}

export async function fetchRepoFile(
  token: string,
  owner: string,
  repo: string,
  path: string
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const res = await githubFetch(token, url, "application/vnd.github.v3.raw")
  if (!res) return null
  return await res.text()
}
