import { fetchRepoFile } from "../../github/client";
import { parseCSV } from "./parser";
import { getTargetMonths } from "../../utils/date";

export async function fetchExpenses(
  token: string,
  owner: string,
  repo: string,
  year: number,
  month: number,
) {
  const targets = getTargetMonths(year, month);
  const all = [];
  for (const t of targets) {
    const text = await fetchRepoFile(
      token,
      owner,
      repo,
      `expenses/${t.year}/${t.month}.csv`,
    );
    if (!text) continue;
    all.push(...parseCSV(text));
  }
  return all;
}
