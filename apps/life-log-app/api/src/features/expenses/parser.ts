import { type Expense } from "./types";

export function parseCSV(csvText: string): Expense[] {
  const trimmed = csvText.trim();
  if (!trimmed) return [];

  const lines = trimmed.split("\n");
  return lines.slice(1).flatMap((line) => {
    const [item, amount, date] = line.split(",");
    if (!item || !amount || !date) return [];
    return [
      {
        item,
        amount: Number(amount),
        date,
      },
    ];
  });
}
