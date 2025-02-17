import httpStatus from "http-status";
import Task from "../models/task.model";
import { TaskStatistics } from "../types/task.types";
import ApiError from "../utils/ApiError";

// const createTask = async (taskData: any) => {

//   return Task.create(...taskData, "createdBy" : taskData.userId);
// };

const createTask = async (taskData: any) => {
  return Task.create(taskData);
};

const getTasks = async ({ userId }: { userId: string }) => {
  console.log("userId", userId);
  return Task.find({ createdBy: userId });
};

const queryTasks = async (filter: any, options: any) => {
  const tasks = await (Task as any).paginate(filter, options);
  return tasks;
};

const getTaskById = async (taskId: string, userId: string) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }
  return task;
};

const updateTask = async (taskId: string, updateData: any, userId: string) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    updateData,
    { new: true }
  );
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }
  return task;
};

const deleteTask = async (taskId: string, userId: string) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }
  return task;
};

const getTaskStatistics = async (userId: string): Promise<TaskStatistics> => {
  const tasks = await Task.find({ createdBy: userId });
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.status === "Completed");
  const pendingTasks = tasks.filter((task) => task.status === "Pending");

  const completedTasksCount = completedTasks.length;
  const pendingTasksCount = pendingTasks.length;

  const completedPercentage =
    totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;
  const pendingPercentage =
    totalTasks > 0 ? (pendingTasksCount / totalTasks) * 100 : 0;

  const totalCompletionTime = completedTasks.reduce(
    (acc: number, task: any) => {
      if (task.endTime) {
        const duration =
          (new Date(task.endTime).getTime() -
            new Date(task.startTime).getTime()) /
          (1000 * 60 * 60);
        return acc + duration;
      }
      return acc;
    },
    0
  );

  const averageCompletionTime =
    completedTasksCount > 0 ? totalCompletionTime / completedTasksCount : 0;

  // Calculate total elapsed time for pending tasks
  const currentTime = new Date().getTime();
  const totalElapsedTime = pendingTasks.reduce((acc, task) => {
    const elapsed =
      (currentTime - new Date(task.startTime).getTime()) / (1000 * 60 * 60);
    return acc + elapsed;
  }, 0);

  const estimatedTimeToFinish = pendingTasks.reduce((acc, task) => {
    if (task.endTime) {
      const remainingTime =
        (new Date(task.endTime).getTime() - currentTime) / (1000 * 60 * 60);
      return acc + Math.max(0, remainingTime);
    }
    return acc + averageCompletionTime;
  }, 0);

  interface PrioritySummary {
    [key: string]: {
      priority: string;
      pendingTasks: number;
    };
  }

  const taskSummary = tasks.reduce<PrioritySummary>((summary, task) => {
    if (task.status === "Pending") {
      const priority = task.priority;

      if (!summary[priority]) {
        summary[priority] = {
          priority,
          pendingTasks: 0,
        };
      }

      summary[priority].pendingTasks += 1;
    }
    return summary;
  }, {});

  const formattedTaskSummary = Object.values(taskSummary).sort(
    (a: any, b: any) => a.priority - b.priority
  );

  return {
    totalTasks,
    completedPercentage: Number(completedPercentage.toFixed(2)),
    pendingPercentage: Number(pendingPercentage.toFixed(2)),
    averageCompletionTime: Number(averageCompletionTime.toFixed(2)),
    pendingTasksCount,
    totalElapsedTime: Number(totalElapsedTime.toFixed(2)),
    estimatedTimeToFinish: Number(estimatedTimeToFinish.toFixed(2)),

    summary: formattedTaskSummary,
  };
};

export default {
  createTask,
  getTasks,
  queryTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStatistics,
};
