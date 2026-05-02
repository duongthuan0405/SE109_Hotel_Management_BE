import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import positionController from "../controllers/PositionController.js";

const positionRoutes = Router();

// Chỉ Admin được CRUD chức vụ (master data)
positionRoutes.get("/", authMiddleware, roleMiddleware(["Admin"]), positionController.getAll);
positionRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin"]), positionController.getById);
positionRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), positionController.create);
positionRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), positionController.update);
positionRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), positionController.delete);

export default positionRoutes;
