"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

interface TaskStatistics {
  totalTasks: number;
  completedPercentage: number;
  pendingPercentage: number;
  averageCompletionTime: number;
  pendingTasksCount: number;
  totalElapsedTime: number;
  estimatedTimeToFinish: number;
  summary: Object[];
}

export default function DashboardPage() {
  const [tasksStatistics, setTasksStatistics] = useState<any>(null);

  useEffect(() => {
    getTasksStatistics();
  }, []);

  const getTasksStatistics = async () => {
    const response = await axiosInstance.get("/tasks/statistics");
    console.log(response.data.data)
    setTasksStatistics(response.data.data);

    return response.data;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total tasks"
            value={tasksStatistics?.totalTasks}
            className="bg-white"
          />
          <StatsCard
            title="Tasks completed"
            value={tasksStatistics?.completedPercentage + "%"}
            className="bg-white"
          />
          <StatsCard
            title="Tasks pending"
            value={tasksStatistics?.pendingPercentage + "%"}
            className="bg-white"
          />
          <StatsCard
            title="Average time per completed task"
            value={tasksStatistics?.averageCompletionTime + " Hr"}
            className="bg-white"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Pending task summary</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Pending tasks"
            value={tasksStatistics?.pendingTasksCount}
            className="bg-white"
          />
          <StatsCard
            title="Total time lapsed"
            value={tasksStatistics?.totalElapsedTime + " Hr"}
            className="bg-white"
          />
          <StatsCard
            title="Total time to finish"
            value={tasksStatistics?.estimatedTimeToFinish + " Hr"}
            description="estimated based on endtime"
            className="bg-white"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Priority-based Task Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task priority</TableHead>
                <TableHead>Pending tasks</TableHead>
                <TableHead>Time lapsed (hrs)</TableHead>
                <TableHead>Time to finish (hrs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasksStatistics?.summary?.map((row: any) => (
                <TableRow key={row.priority}>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.pendingTasks}</TableCell>
                  {/* <TableCell>{row.lapsed}</TableCell>
                  <TableCell>{row.toFinish}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  className,
}: {
  title: string;
  value: string;
  description?: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
