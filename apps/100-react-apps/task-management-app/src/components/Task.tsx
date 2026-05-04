import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";

import { Tasks } from "@/context/TaskContext";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BsThreeDots } from "react-icons/bs";

const STATUS = ["Yet", "Progress", "Done"] as const;

const Task = ({ task }: { task: Tasks }) => {
  const { tasks, setTasks } = useContext(TaskContext)!;

  return (
    <li className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={task.id.toString()}
          checked={task.status === "Done"}
          onCheckedChange={(checked) => {
            setTasks(
              tasks.map((t) =>
                t.id === task.id
                  ? { ...t, status: checked ? "Done" : "Yet" }
                  : t
              )
            );
          }}
        />
        <label
          htmlFor={task.id.toString()}
          className={`font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
            ${
              task.status === "Done"
                ? "text-gray-400 line-through decoration-black"
                : ""
            }
          `}
        >
          {task.task}
        </label>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to...</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {STATUS.filter((status) => task.status !== status).map(
                  (status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => {
                        setTasks(
                          tasks.map((t) =>
                            t.id === task.id
                              ? {
                                  ...t,
                                  status: status as "Yet" | "Progress" | "Done",
                                }
                              : t
                          )
                        );
                      }}
                      className={status === "Done" ? "text-green-700" : ""}
                    >
                      {status}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => {
              setTasks(tasks.filter((t) => t.id !== task.id));
            }}
            className="text-red-700"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};

export default Task;
