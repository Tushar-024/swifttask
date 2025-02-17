import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import taskService from "../services/task.service";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";

export const taskController = {
  createTask: catchAsync(async (req: AuthRequest, res: Response) => {


    console.log("req.user", req.user);

    const task = await taskService.createTask({
      ...req.body,
      createdBy: req.user.sub,
    });
    res.status(201).json({
      status: "success",
      data: task,
    });
  }),

  getTasks: catchAsync(async (req: AuthRequest, res: Response) => {
    const tasks = await taskService.getTasks({
      userId: req.user.sub,
    });
    res.json({
      status: "success",
      data: tasks,
    });
  }),

  getTask: catchAsync(async (req: AuthRequest, res: Response) => {
    const task = await taskService.getTaskById(req.params.taskId, req.user.id);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    res.json({
      status: "success",
      data: task,
    });
  }),

  updateTask: catchAsync(async (req: AuthRequest, res: Response) => {
    const task = await taskService.updateTask(
      req.params.taskId,
      req.body,
      req.user.id
    );
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    res.json({
      status: "success",
      data: task,
    });
  }),

  deleteTask: catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await taskService.deleteTask(req.params.taskId, req.user.id);
    if (!result) {
      throw new ApiError(404, "Task not found");
    }
    res.status(204).send();
  }),

  getTaskStatistics: catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.sub;
    const statistics = await taskService.getTaskStatistics(userId);
    res.json({
      status: "success",
      data: statistics,
    });
  }),
};
