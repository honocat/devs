import { Card, CardContent } from "@/components/ui/card"

import { formatYear } from "@/pages/expenses/utils/date"
import type { Expense } from "@/pages/expenses/utils/types"

interface Props {
  selected: Date
  data: Expense[]
}

export default function ExpenseDetail(props: Props) {
  const { selected, data } = props
  return (
    <Card className="w-full">
      <CardContent className="space-y-3 p-4">
        <h2 className="text-sm font-semibold">
          {formatYear(selected)}年{selected.getMonth() + 1}月{selected.getDate()}日 出費詳細
        </h2>
        {data.length > 0 ? (
          <ul className="space-y-1">
            {data.map((expense, index) => (
              <li
                key={`${expense.date}-${expense.item}-${index}`}
                className="flex justify-between text-sm"
              >
                <span>{expense.item}</span>
                <span>¥ {expense.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No data.</p>
        )}
      </CardContent>
    </Card>
  )
}
