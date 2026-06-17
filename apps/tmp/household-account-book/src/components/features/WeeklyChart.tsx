import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { formatMonthLabel } from "@/components/utils/date"
import type { WeeklyPoint } from "@/components/utils/types"
import { formatYen } from "@/components/utils/stats"

interface Props {
  data: WeeklyPoint[]
  modeLabel: string
  selectedDate: Date
}

export default function WeeklyChart(props: Props) {
  const { data, modeLabel, selectedDate } = props

  return (
    <Card className="w-full">
      <CardHeader className="border-b px-4 py-4">
        <CardTitle className="text-base">{modeLabel}週次棒グラフ</CardTitle>
        <CardDescription>{formatMonthLabel(selectedDate)} を含む週の推移</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dayLabel" />
              <YAxis tickFormatter={(v) => `¥${formatYen(v)}`} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.dateKey}
                    fill={entry.total >= 0 ? "rgb(16 185 129)" : "rgb(244 63 94)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
