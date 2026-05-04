import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import notificationController from "../controllers/NotificationController.js";

const notificationRoutes = Router();

// Cả Customer và Staff đều có thể xem và đánh dấu thông báo
notificationRoutes.get("/", authMiddleware, roleMiddleware(["Customer", "Admin", "Staff"]), notificationController.getNotifications);
notificationRoutes.put("/:id/read", authMiddleware, roleMiddleware(["Customer", "Admin", "Staff"]), notificationController.markAsRead);

export default notificationRoutes;
