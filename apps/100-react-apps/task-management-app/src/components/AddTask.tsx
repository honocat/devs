import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";

import { Tasks } from "@/context/TaskContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AddTask = () => {
  const { task, setTask, tasks, setTasks } = useContext(TaskContext)!;
  return (
    <div className="flex space-x-2">
      <Input
        placeholder="Type your task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <Button
        onClick={() => {
          if (task === "") {
            toast("Type your task.");
            return;
          }
          const newTask: Tasks = {
            id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
            task: task,
            status: "Yet",
          };
          setTasks([...tasks, newTask]);
          setTask("");
        }}
      >
        Add
      </Button>
    </div>
  );
};

export default AddTask;
