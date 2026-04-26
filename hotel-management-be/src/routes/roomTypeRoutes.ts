import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import roomTypeController from "../controllers/RoomTypeController.js";

const roomTypeRoutes = Router();

// Các API công khai (Khách hàng xem danh sách loại phòng để đặt phòng)
roomTypeRoutes.get("/", roomTypeController.getAllRoomTypes);
roomTypeRoutes.get("/:id", roomTypeController.getRoomTypeById);

// Các API quản lý (Chỉ dành cho Admin, cần xác thực)
roomTypeRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), roomTypeController.createRoomType);
roomTypeRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), roomTypeController.updateRoomType);
roomTypeRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), roomTypeController.deleteRoomType);

export default roomTypeRoutes;
