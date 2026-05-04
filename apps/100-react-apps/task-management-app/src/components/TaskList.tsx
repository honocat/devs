import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";

import Task from "@/components/Task";

import { TabsContent } from "@/components/ui/tabs";

const TaskList = ({ APPEARANCE }: { APPEARANCE: string[] }) => {
  const { tasks } = useContext(TaskContext)!;
  return (
    <>
      {APPEARANCE.map((app) => (
        <TabsContent key={app} value={app} className="pt-4">
          <ul className="space-y-4">
            {app === "All"
              ? tasks.map((task) => <Task key={task.id} task={task} />)
              : tasks
                  .filter((task) => task.status === app)
                  .map((task) => <Task key={app} task={task} />)}
          </ul>
        </TabsContent>
      ))}
    </>
  );
};

export default TaskList;
