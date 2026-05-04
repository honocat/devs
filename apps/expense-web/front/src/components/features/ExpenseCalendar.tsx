import type { DateRange } from "react-day-picker"

import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

import { formatDate } from "@/lib/expense"

interface Props {
  selected: Date
  currentMonth: Date
  range: DateRange
  data: Record<string, number>
  onSelect: (date: Date) => void
  onMonthChange: (month: Date) => void
}

export default function ExpenseCalendar(props: Props) {
  const { selected, currentMonth, range, data, onSelect, onMonthChange } = props
  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => date && onSelect(date)}
          month={currentMonth}
          onMonthChange={(month) => onMonthChange(month)}
          numberOfMonths={1}
          captionLayout="dropdown"
          className="w-full max-w-full [--cell-size:clamp(2rem,11vw,3rem)] sm:[--cell-size:--spacing(12)]"
          components={{
            DayButton: ({ children, day, ...props }) => {
              const key = formatDate(day.date)

              const total = data[key]
              const isInSelectedWeek =
                !!range.from &&
                !!range.to &&
                day.date >= range.from &&
                day.date <= range.to

              const dayOfWeek = day.date.getDay()
              const weekRoundedClass =
                dayOfWeek === 0
                  ? "rounded-l-md"
                  : dayOfWeek === 6
                    ? "rounded-r-md"
                    : "rounded-none"
              return (
                <div
                  className={`w-full ${isInSelectedWeek ? "bg-accent text-accent-foreground" : ""} ${isInSelectedWeek ? weekRoundedClass : ""}`}
                >
                  <CalendarDayButton
                    day={day}
                    {...props}
                    className="rounded-md"
                  >
                    <div className="flex h-full flex-col items-center justify-start pt-2">
                      <span>{children}</span>
                      <span className="h-4 text-xs leading-none">
                        {total != null && `¥${total.toLocaleString()}`}
                      </span>
                    </div>
                  </CalendarDayButton>
                </div>
              )
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
