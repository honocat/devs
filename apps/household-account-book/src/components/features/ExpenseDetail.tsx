import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { formatYear } from "@/components/utils/date"
import type { Transaction } from "@/components/utils/types"

interface Props {
  selected: Date
  data: Transaction[]
  selection: string
}

export default function ExpenseDetail(props: Props) {
  const { selected, data, selection } = props
  return (
    <Card className="w-full">
      <CardHeader className="flex">
        <CardTitle className="font-semibold">{selection}変動詳細</CardTitle>
        <CardDescription className="mt-auto">
          {formatYear(selected)}年{selected.getMonth() + 1}月
          {selected.getDate()}日
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ul className="space-y-1">
            {data.map((expense) => (
              <li
                key={`${expense.id}`}
                className="flex justify-between text-sm"
              >
                <span>
                  {expense.summary}（{expense.category}）
                </span>
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
