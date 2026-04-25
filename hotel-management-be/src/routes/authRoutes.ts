import { Router } from "express";
import authController from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/forgot-password", authController.forgotPassword);
authRoutes.post("/reset-password-otp", authController.resetPasswordWithOTP);

export default authRoutes;
