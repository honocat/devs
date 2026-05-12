import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"

import type { Weekly } from "@/pages/expenses/utils/types"

interface Props {
  data: Weekly[]
  max: number
}

export default function WeeklyChart(props: Props) {
  const { data, max } = props
  return (
    <Card className="w-full">
      <CardContent className="space-y-3 p-4">
        <h2 className="text-sm font-semibold">Weekly Chart</h2>
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
