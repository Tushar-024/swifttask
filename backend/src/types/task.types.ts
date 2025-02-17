export interface TaskStatistics {
  totalTasks: number;
  completedPercentage: number;
  pendingPercentage: number;
  averageCompletionTime: number;
  pendingTasksCount: number;
  totalElapsedTime: number;
  estimatedTimeToFinish: number;
  summary: Array<{
    priority: string;
    pendingTasks: number;
  }>;
}

export interface Task {
  _id: string;
  title: string;
  status: "pending" | "completed";
  startTime: Date;
  endTime?: Date;
  estimatedDuration: number;
}
