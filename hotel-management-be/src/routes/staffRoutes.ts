import { Router } from "express";
import staffController from "../controllers/StaffController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const staffRoutes = Router();

// API cho nhân viên tự xem/sửa hồ sơ
staffRoutes.get("/me", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), staffController.getMyProfile);
staffRoutes.put("/me", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), staffController.updateMyProfile);

// API quản lý nhân viên (chỉ Admin)
staffRoutes.get("/", authMiddleware, roleMiddleware(["Admin"]), staffController.getAllStaffs);
staffRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin"]), staffController.getStaffById);
staffRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), staffController.createStaff);
staffRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), staffController.updateStaff);
staffRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), staffController.deleteStaff);

export default staffRoutes;
