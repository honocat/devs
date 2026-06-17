import { useMemo, useState } from "react"

import ExpenseCalendar from "@/components/features/ExpenseCalendar"
import ExpenseDetail from "@/components/features/ExpenseDetail"
import MonthlyChart from "@/components/features/MonthlyChart"
import WeeklyChart from "@/components/features/WeeklyChart"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  formatSignedYen,
  getCalendarData,
  getDetailData,
  getMonthlyData,
  getVisibleJournalLines,
  getWeeklyData,
  normalizeJournalLines,
} from "@/components/utils/stats"
import type { ViewMode } from "@/components/utils/types"

import { Container } from "@/components/layouts/Container"

type ModeConfig = {
  label: string
  description: string
}

const modeConfig: Record<ViewMode, ModeConfig> = {
  cashflow: {
    label: "収支",
    description: "費用と収益のみを集計します。",
  },
  "asset-move": {
    label: "資産移動",
    description: "資産の増減のみを集計します。",
  },
}

async function fetchData() {
  const url = `/api/test`
  const res = await fetch(url)
  const body = await res.json()
  console.log(body)
  return body.results
}

const journalLines = normalizeJournalLines(
  fetchData() as Parameters<typeof normalizeJournalLines>[0]
)

const initialSelectedDate = journalLines[0]
  ? new Date(journalLines[0].dateTime)
  : new Date()

const initialSelectedMonth = new Date(
  initialSelectedDate.getFullYear(),
  initialSelectedDate.getMonth(),
  1
)

export function App() {
  const [selectedMode, setSelectedMode] = useState<ViewMode>("cashflow")
  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate)
  const [selectedMonth, setSelectedMonth] = useState<Date>(initialSelectedMonth)

  const visibleLines = useMemo(
    () => getVisibleJournalLines(journalLines, selectedMode),
    [selectedMode]
  )
  const calendarData = useMemo(
    () => getCalendarData(visibleLines),
    [visibleLines]
  )
  const weeklyData = useMemo(
    () => getWeeklyData(visibleLines, selectedDate),
    [visibleLines, selectedDate]
  )
  const detailData = useMemo(
    () => getDetailData(visibleLines, selectedDate),
    [visibleLines, selectedDate]
  )
  const monthlyData = useMemo(
    () => getMonthlyData(visibleLines, selectedMonth),
    [visibleLines, selectedMonth]
  )

  const pageMode = modeConfig[selectedMode]
  const selectedDayTotal = detailData.reduce(
    (sum, line) => sum + line.signedAmount,
    0
  )
  const weeklyTotal = weeklyData.reduce((sum, line) => sum + line.total, 0)
  const monthlyTotal = monthlyData.at(-1)?.cumulativeTotal ?? 0

  return (
    <Container>
      <div className="w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full px-4">
              {pageMode.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setSelectedMode("cashflow")}>
              収支
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedMode("asset-move")}>
              資産移動
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="">
        <ExpenseCalendar
          selectedDate={selectedDate}
          visibleMonth={selectedMonth}
          data={calendarData}
          modeLabel={pageMode.label}
          onSelect={(date) => {
            setSelectedDate(date)
            setSelectedMonth(new Date(date.getFullYear(), date.getMonth(), 1))
          }}
          onMonthChange={(month) =>
            setSelectedMonth(new Date(month.getFullYear(), month.getMonth(), 1))
          }
        />
        <ExpenseDetail
          selectedDate={selectedDate}
          data={detailData}
          modeLabel={pageMode.label}
        />
        <WeeklyChart
          data={weeklyData}
          modeLabel={pageMode.label}
          selectedDate={selectedDate}
        />
        <MonthlyChart
          data={monthlyData}
          modeLabel={pageMode.label}
          selectedMonth={selectedMonth}
        />
      </div>

      <footer className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
          週次合計:{" "}
          <span className="font-medium text-foreground">
            {formatSignedYen(weeklyTotal)}
          </span>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
          選択日合計:{" "}
          <span className="font-medium text-foreground">
            {formatSignedYen(selectedDayTotal)}
          </span>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
          月次累積:{" "}
          <span className="font-medium text-foreground">
            {formatSignedYen(monthlyTotal)}
          </span>
        </div>
      </footer>
    </Container>
  )
}

export default App
