import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import serviceController from "../controllers/ServiceController.js";

const serviceRoutes = Router();

const allRoles = ["Admin", "Manager", "Receptionist", "Customer"];
const adminRoles = ["Admin", "Manager"];

serviceRoutes.get("/", authMiddleware, roleMiddleware(allRoles), serviceController.getAll);
serviceRoutes.get("/:id", authMiddleware, roleMiddleware(allRoles), serviceController.getById);

serviceRoutes.post("/", authMiddleware, roleMiddleware(adminRoles), serviceController.create);
serviceRoutes.put("/:id", authMiddleware, roleMiddleware(adminRoles), serviceController.update);
serviceRoutes.delete("/:id", authMiddleware, roleMiddleware(adminRoles), serviceController.delete);

export default serviceRoutes;
