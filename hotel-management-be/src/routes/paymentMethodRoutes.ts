import { Router } from "express";
import paymentMethodController from "../controllers/PaymentMethodController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const paymentMethodRoutes = Router();

// Everyone (staff) can read payment methods (for making invoices)
paymentMethodRoutes.get("/", authMiddleware, paymentMethodController.getAllPaymentMethods);
paymentMethodRoutes.get("/:id", authMiddleware, paymentMethodController.getPaymentMethodById);

// Only Admin can modify
paymentMethodRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), paymentMethodController.createPaymentMethod);
paymentMethodRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), paymentMethodController.updatePaymentMethod);
paymentMethodRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), paymentMethodController.deletePaymentMethod);

export default paymentMethodRoutes;
