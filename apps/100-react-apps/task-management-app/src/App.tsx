import AddTask from "@/components/AddTask";
import TaskList from "@/components/TaskList";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const APPEARANCE = ["All", "Yet", "Progress", "Done"];

function App() {
  return (
    <>
      <Card className="max-w-lg mx-auto mt-20">
        <CardHeader>
          <CardTitle>Task Management App</CardTitle>
          <CardDescription>Let&apos;s management your tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddTask />
        </CardContent>
        <CardContent>
          <Tabs defaultValue="All">
            <TabsList className="grid w-full grid-cols-4">
              {APPEARANCE.map((app) => (
                <TabsTrigger key={app} value={app}>
                  {app}
                </TabsTrigger>
              ))}
            </TabsList>
            <TaskList APPEARANCE={APPEARANCE} />
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

export default App;
