import { Router } from "express";
import customerController from "../controllers/CustomerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const customerRoutes = Router();

// API dành cho khách hàng tự quản lý hồ sơ
customerRoutes.get("/me", authMiddleware, roleMiddleware(["Customer"]), customerController.getMyProfile);
customerRoutes.put("/me", authMiddleware, roleMiddleware(["Customer"]), customerController.updateMyProfile);

// API dành cho Admin và Lễ tân quản lý khách hàng
customerRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), customerController.getAllCustomers);
customerRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), customerController.getCustomerById);
customerRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), customerController.createCustomer);
customerRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), customerController.updateCustomer);
customerRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), customerController.deleteCustomer);

export default customerRoutes;
