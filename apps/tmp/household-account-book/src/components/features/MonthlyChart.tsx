import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { formatMonthLabel } from "@/components/utils/date"
import type { MonthlyPoint } from "@/components/utils/types"
import { formatYen } from "@/components/utils/stats"

interface Props {
  data: MonthlyPoint[]
  modeLabel: string
  selectedMonth: Date
}

export default function MonthlyChart(props: Props) {
  const { data, modeLabel, selectedMonth } = props

  return (
    <Card className="w-full">
      <CardHeader className="border-b px-4 py-4">
        <CardTitle className="text-base">{modeLabel}月次線グラフ</CardTitle>
        <CardDescription>{formatMonthLabel(selectedMonth)} の累積推移</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(v) => `¥${formatYen(v)}`} />
              <Line
                type="monotone"
                dataKey="cumulativeTotal"
                stroke="rgb(14 165 233)"
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
