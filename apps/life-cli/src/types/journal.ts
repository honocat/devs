export type FocusReflectionStatus = "達成" | "一部達成" | "未達" | "未設定";

export type TodayFocus = {
  date: string; // YYYY-MM-DD
  smallWin: string;
  task: string;
};

export type MorningJournalPayload = {
  target3M: string;
  task: string;
  smallWin: string;
  idea: string;
};

export type NightJournalPayload = {
  tenYearsLaterLabel: string;
  tenYearVision: string;
  oneYearGoal: string;
  gratitude: string;
  insight: string;
  smallWinResult: "達成" | "未達";
  smallWinReflection: string;
  taskResult: "達成" | "未達";
  taskReflection: string;
  tomorrowTask: string;
  todaySmallWin?: string;
  todayTask?: string;
};
