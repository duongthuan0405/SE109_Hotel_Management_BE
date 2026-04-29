import { Router } from "express";
import rentalReceiptController from "../controllers/RentalReceiptController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const rentalReceiptRoutes = Router();

// Lấy danh sách và chi tiết (Staff roles)
rentalReceiptRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), rentalReceiptController.getAllRentalReceipts);
rentalReceiptRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), rentalReceiptController.getRentalReceiptById);

// Tạo mới (Check-in) và Cập nhật
rentalReceiptRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), rentalReceiptController.createRentalReceipt);
rentalReceiptRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), rentalReceiptController.updateRentalReceipt);

// Check-out (Bị vô hiệu hóa vì đã gộp vào Invoice Checkout)
// rentalReceiptRoutes.post("/:id/checkout", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), rentalReceiptController.checkOut);

// Xóa (Chỉ Admin)
rentalReceiptRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), rentalReceiptController.deleteRentalReceipt);

export default rentalReceiptRoutes;
