export type TaskStatus = "pending" | "finished";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  status: TaskStatus;
  startTime: Date;
  endTime: Date;
}
