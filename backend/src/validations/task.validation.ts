import Joi from "joi";

export const taskValidation = {
  createTask: {
    body: Joi.object().keys({
      title: Joi.string().required().min(1).max(100),
      description: Joi.string().optional().max(500),
      dueDate: Joi.date().optional(),
      priority: Joi.string().valid("low", "medium", "high").optional(),
      status: Joi.string()
        .valid("todo", "in_progress", "completed")
        .default("todo"),
    }),
  },

  updateTask: {
    params: Joi.object().keys({
      taskId: Joi.string().required().hex().length(24),
    }),
    body: Joi.object().keys({
      title: Joi.string().optional().min(1).max(100),
      description: Joi.string().optional().max(500),
      dueDate: Joi.date().optional(),
      priority: Joi.string().valid("low", "medium", "high").optional(),
      status: Joi.string().valid("todo", "in_progress", "completed").optional(),
    }),
  },

  getTask: {
    params: Joi.object().keys({
      taskId: Joi.string().required().hex().length(24),
    }),
  },

  getTasks: {
    query: Joi.object().keys({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(100).optional(),
      status: Joi.string().valid("todo", "in_progress", "completed").optional(),
      priority: Joi.string().valid("low", "medium", "high").optional(),
    }),
  },
};
