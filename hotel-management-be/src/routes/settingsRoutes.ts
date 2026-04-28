import { Router } from "express";
import settingsController from "../controllers/SettingsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const settingsRoutes = Router();

settingsRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Manager"]), settingsController.getSettings);
settingsRoutes.put("/", authMiddleware, roleMiddleware(["Admin"]), settingsController.updateSettings);

export default settingsRoutes;
