export type FocusReflectionStatus = "達成" | "一部達成" | "未達" | "未設定";

export type TodayFocus = {
  date: string; // YYYY-MM-DD
  smallWin: string;
  task: string;
};

export type MorningJournalPayload = {
  targetY: string;
  target3M: string;
  task: string;
  smallWin: string;
  idea: string;
};

export type NightJournalPayload = {
  gratitude: string;
  insight: string;
  tomorrowTask: string;
  note?: string;
  todaySmallWin?: string;
  todayTask?: string;
  smallWinStatus: FocusReflectionStatus;
  taskStatus: FocusReflectionStatus;
};

