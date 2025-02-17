import express from "express";
import authRoute from "./auth.route";
import taskRoute from "./task.route";

const router = express.Router();

router.use("/auth", authRoute);

router.use("/tasks", taskRoute);

export default router;
