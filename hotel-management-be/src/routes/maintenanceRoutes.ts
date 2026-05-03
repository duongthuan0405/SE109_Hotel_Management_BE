import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import maintenanceController from "../controllers/MaintenanceController.js";

const maintenanceRoutes = Router();

// Staff routes
maintenanceRoutes.get("/next-code", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), maintenanceController.getNextCode);
maintenanceRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), maintenanceController.create);
maintenanceRoutes.get("/", authMiddleware, maintenanceController.getAll);
maintenanceRoutes.get("/guest/requests", authMiddleware, roleMiddleware(["Customer"]), maintenanceController.guestGetRequests);
maintenanceRoutes.post("/guest/request", authMiddleware, roleMiddleware(["Customer"]), maintenanceController.guestCreateRequest);
maintenanceRoutes.get("/:id", authMiddleware, maintenanceController.getById);
maintenanceRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), maintenanceController.update);
maintenanceRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), maintenanceController.delete);

export default maintenanceRoutes;
