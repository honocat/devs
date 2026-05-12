import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"

import type { Monthly } from "@/pages/expenses/utils/types"
import { formatYear } from "@/pages/expenses/utils/date"

interface Props {
  data: Monthly[]
  max: number
  month: Date
}

export default function MonthlyChart(props: Props) {
  const { data, max, month } = props
  return (
    <Card className="w-full">
      <CardContent className="space-y-3 p-4">
        <h2 className="text-sm font-semibold">
          月次累計出費額 ({formatYear(month)}年{month.getMonth() + 1}月)
        </h2>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, max]} tickFormatter={(v) => `¥${v}`} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
