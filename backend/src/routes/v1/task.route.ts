import express from "express";
import { taskController } from "../../controllers/task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
// import { validate } from "../../middlewares/validate.middleware";
// import taskValidation  from "../../validations/task.validation";

const router = express.Router();

router.use(authMiddleware);

router.route("/").post(taskController.createTask).get(taskController.getTasks);

router.get("/statistics", taskController.getTaskStatistics);

router
  .route("/:taskId")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;
