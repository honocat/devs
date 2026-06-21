import {
  BarChart,
  Bar,
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
import { formatYear } from "@/components/utils/date"

import type { Weekly } from "@/components/utils/types"
import type { DateRange } from "react-day-picker"

interface Props {
  data: Weekly[]
  max: number
  selection: string
  range: DateRange
}

export default function WeeklyChart(props: Props) {
  const { data, max, selection, range } = props

  const from = range.from
    ? `${formatYear(range.from)}年${range.from.getMonth() + 1}月${range.from.getDate()}日`
    : "-"
  const to = range.to
    ? `${formatYear(range.to)}年${range.to.getMonth() + 1}月${range.to.getDate()}日`
    : "-"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">
          {selection} 週間変動額（曜日別）
        </CardTitle>
        <CardDescription>
          {from} - {to}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, max]} tickFormatter={(v) => `¥ ${v}`} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
