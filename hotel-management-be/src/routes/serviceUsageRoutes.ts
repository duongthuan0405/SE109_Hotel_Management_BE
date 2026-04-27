import { Router } from "express";
import serviceUsageController from "../controllers/ServiceUsageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const serviceUsageRoutes = Router();

// Lấy danh sách và chi tiết (Staff roles)
serviceUsageRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), serviceUsageController.getAllServiceUsages);
serviceUsageRoutes.get("/customer/:customerId", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), serviceUsageController.getServiceUsagesByCustomerId);
serviceUsageRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), serviceUsageController.getServiceUsageById);

// Tạo mới và Cập nhật
serviceUsageRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageController.createServiceUsage);
serviceUsageRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageController.updateServiceUsage);

// Xóa (Chỉ Admin)
serviceUsageRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), serviceUsageController.deleteServiceUsage);

export default serviceUsageRoutes;
