import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import roomController from "../controllers/RoomController.js";

const roomRoutes = Router();

// Public APIs (optional, if customers can see rooms)
roomRoutes.get("/", roomController.getAllRooms);
roomRoutes.get("/:id", roomController.getRoomById);

// Admin/Receptionist APIs
roomRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), roomController.createRoom);
roomRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), roomController.updateRoom);
roomRoutes.post("/:id/status", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), roomController.updateStatus);
roomRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), roomController.deleteRoom);

export default roomRoutes;
