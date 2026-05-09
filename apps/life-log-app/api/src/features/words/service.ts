import { fetchRepoDir } from "../../github/client";
import { parseWord } from "./parser";

export async function fetchWords(token: string, owner: string, repo: string) {
  const files = await fetchRepoDir(token, owner, repo, "words/data");
  const mdFiles = files.filter((f: any) => f.name.endsWith(".md"));

  return Promise.all(
    mdFiles.map(async (file: any) => {
      const text = await fetch(file.download_url).then((r) => r.text());
      return parseWord(text, file.name);
    }),
  );
}
