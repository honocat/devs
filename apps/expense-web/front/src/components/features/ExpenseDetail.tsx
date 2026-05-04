import { Card, CardContent } from "@/components/ui/card"

import { formatDate, type Expense } from "@/lib/expense"

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
          Detail of {formatDate(selected)}
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
