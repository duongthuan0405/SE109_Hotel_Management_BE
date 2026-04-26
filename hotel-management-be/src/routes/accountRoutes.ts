import { Router } from "express";
import accountController from "../controllers/AccountController.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const accountRoutes = Router();

// API cá nhân (Self-service - Cần xác thực, ai đăng nhập cũng dùng được)
accountRoutes.get("/me", authMiddleware, accountController.getMe);
accountRoutes.put("/me", authMiddleware, accountController.updateMe);
accountRoutes.put("/me/change-password", authMiddleware, accountController.changePassword);

// Các API cho Admin (Cần xác thực và kiểm tra quyền Admin)
accountRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), accountController.createAccount);
accountRoutes.get("/", authMiddleware, roleMiddleware(["Admin"]), accountController.getAllAccounts);
accountRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin"]), accountController.getAccountById);
accountRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), accountController.updateAccount);
accountRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), accountController.deleteAccount);


export default accountRoutes;
