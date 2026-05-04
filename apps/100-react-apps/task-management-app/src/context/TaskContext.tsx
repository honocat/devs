import { createContext, useState } from "react";

export type Tasks = {
  id: number;
  task: string;
  status: "Yet" | "Progress" | "Done";
};

export const TaskContext = createContext<{
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
  tasks: Tasks[];
  setTasks: React.Dispatch<React.SetStateAction<Tasks[]>>;
} | null>(null);

const initialTasks: Tasks[] = [
  // { id: 1, task: "shopping", status: "Yet" },
  // { id: 2, task: "programming", status: "Progress" },
  // { id: 3, task: "contact", status: "Done" },
  // { id: 4, task: "walking", status: "Yet" },
];

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Tasks[]>(initialTasks);

  return (
    <TaskContext.Provider value={{ task, setTask, tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
