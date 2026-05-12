type Env = {
  GITHUB_API_TOKEN?: string
  OWNER?: string
  REPO?: string
}

export type RequestContext = {
  request: Request
  env: Env
}
