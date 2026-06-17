import { ja } from "date-fns/locale"

import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { formatDateKey, formatMonthLabel } from "@/components/utils/date"
import type { DaySummary } from "@/components/utils/types"
import { formatYen } from "@/components/utils/stats"

interface Props {
  selectedDate: Date
  visibleMonth: Date
  data: Record<string, DaySummary>
  modeLabel: string
  onSelect: (date: Date) => void
  onMonthChange: (month: Date) => void
}

export default function ExpenseCalendar(props: Props) {
  const {
    selectedDate,
    visibleMonth,
    data,
    modeLabel,
    onSelect,
    onMonthChange,
  } = props

  return (
    <Card className="w-full">
      <CardHeader className="border-b px-4 py-4">
        <CardTitle className="text-base">{modeLabel}カレンダー</CardTitle>
        <CardDescription>{formatMonthLabel(visibleMonth)}の金額表示</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelect(date)}
          month={visibleMonth}
          onMonthChange={onMonthChange}
          numberOfMonths={1}
          locale={ja}
          className="w-full max-w-full [--cell-size:clamp(2rem,11vw,3rem)] sm:[--cell-size:--spacing(12)]"
          components={{
            DayButton: ({ children, day, ...props }) => {
              const key = formatDateKey(day.date)
              const summary = data[key]
              const positive = summary?.positiveTotal ?? 0
              const negative = summary?.negativeTotal ?? 0
              const count = summary?.count ?? 0

              return (
                <CalendarDayButton day={day} {...props} className="rounded-md">
                  <div className="flex h-full flex-col items-center justify-start gap-0.5 pt-1">
                    <span className="text-sm leading-none">{children}</span>
                    {count > 0 ? (
                      <div className="flex flex-col items-center gap-0.5 leading-none">
                        {positive > 0 ? (
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            +¥{formatYen(positive)}
                          </span>
                        ) : null}
                        {negative < 0 ? (
                          <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400">
                            -¥{formatYen(Math.abs(negative))}
                          </span>
                        ) : null}
                        {positive === 0 && negative === 0 ? (
                          <span className="text-[10px] text-muted-foreground">¥0</span>
                        ) : null}
                        {count > 1 ? (
                          <span className="text-[10px] text-muted-foreground">
                            {count}件
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/30">.</span>
                    )}
                  </div>
                </CalendarDayButton>
              )
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
