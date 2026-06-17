import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { formatMonthLabel } from "@/components/utils/date"
import type { VisibleJournalLine } from "@/components/utils/types"
import { formatSignedYen } from "@/components/utils/stats"

interface Props {
  selectedDate: Date
  data: VisibleJournalLine[]
  modeLabel: string
}

export default function ExpenseDetail(props: Props) {
  const { selectedDate, data, modeLabel } = props

  return (
    <Card className="w-full">
      <CardHeader className="border-b px-4 py-4">
        <CardTitle className="text-base">{modeLabel}リスト</CardTitle>
        <CardDescription>
          {formatMonthLabel(selectedDate)} {selectedDate.getDate()}日の明細
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {data.length > 0 ? (
          <ul className="space-y-2">
            {data.map((expense) => (
              <li
                key={`${expense.id}-${expense.dateKey}`}
                className="rounded-lg border border-border/70 bg-background/70 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{expense.summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {expense.detail || expense.accountCategory}・{expense.side}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-semibold ${
                      expense.signedAmount >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {formatSignedYen(expense.signedAmount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">表示対象の明細はありません。</p>
        )}
      </CardContent>
    </Card>
  )
}
