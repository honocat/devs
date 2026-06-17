import { Card, CardContent } from "@/components/ui/card"

import { formatYear } from "@/components/utils/date"
import type { Transaction } from "@/components/utils/types"

interface Props {
  selected: Date
  data: Transaction[]
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
            {data.map((expense) => (
              <li
                key={`${expense.id}`}
                className="flex justify-between text-sm"
              >
                <span>{expense.summary}（{expense.category}）</span>
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
