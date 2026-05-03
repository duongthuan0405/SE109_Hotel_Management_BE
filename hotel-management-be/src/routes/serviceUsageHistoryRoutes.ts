import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import serviceUsageHistoryController from "../controllers/ServiceUsageHistoryController.js";

const serviceUsageHistoryRoutes = Router();

// /usage/:serviceUsageId phải đặt TRƯỚC /:id để tránh Express nhầm "usage" thành id
serviceUsageHistoryRoutes.get("/usage/:serviceUsageId", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageHistoryController.getByServiceUsageId);
serviceUsageHistoryRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageHistoryController.getAll);
serviceUsageHistoryRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageHistoryController.getById);
serviceUsageHistoryRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageHistoryController.create);
serviceUsageHistoryRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageHistoryController.update);
serviceUsageHistoryRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), serviceUsageHistoryController.delete);

export default serviceUsageHistoryRoutes;
