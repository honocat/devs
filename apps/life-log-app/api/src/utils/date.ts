export function getTargetMonths(year: number, month: number) {
  const base = new Date(year, month - 1);

  const prev = new Date(base);
  prev.setMonth(prev.getMonth() - 1);
  const next = new Date(base);
  next.setMonth(next.getMonth() + 1);

  const format = (d: Date) => ({
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
  });

  return [format(prev), format(base), format(next)];
}
