import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import type { Monthly } from "@/components/utils/types"
import { formatYear } from "@/components/utils/date"

interface Props {
  data: Monthly[]
  max: number
  month: Date
  selection: string
}

export default function MonthlyChart(props: Props) {
  const { data, max, month, selection } = props
  return (
    <Card className="w-full">
      <CardHeader className="flex">
        <CardTitle className="font-semibold">{selection} 月間推移</CardTitle>
        <CardDescription className="mt-auto">
          {formatYear(month)}年{month.getMonth() + 1}月
        </CardDescription>
      </CardHeader>
      <CardContent>
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
