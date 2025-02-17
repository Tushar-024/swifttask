import express from "express";
import authController from "../../controllers/auth.controller";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
// router.post("/refresh-tokens", authController.refreshTokens);
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);
export default router;
