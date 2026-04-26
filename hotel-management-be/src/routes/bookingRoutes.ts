import { Router } from "express";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import bookingController from "../controllers/BookingController.js";

const bookingRoutes = Router();

// ==========================================
// CUSTOMER ROUTES (prefix: /customer)
// DTO Wrapper: { success, message, data }
// Role: Customer
// ==========================================
bookingRoutes.post("/customer/", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerCreate);
bookingRoutes.get("/customer/", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerGetAll);
bookingRoutes.get("/customer/history/:customerId", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerGetByCustomerId);
bookingRoutes.get("/customer/:id", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerGetById);
bookingRoutes.put("/customer/:id", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerUpdate);
bookingRoutes.post("/customer/:id/cancel", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerCancel);
bookingRoutes.delete("/customer/:id", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerDelete);

// ==========================================
// STAFF ROUTES (prefix: /)
// DTO Wrapper: Raw JSON
// Role: Admin, Manager, Receptionist
// ==========================================
const staffRoles = ["Admin", "Manager", "Receptionist"];
bookingRoutes.post("/", authMiddleware, roleMiddleware(staffRoles), bookingController.staffCreate);
bookingRoutes.post("/walk-in", authMiddleware, roleMiddleware(staffRoles), bookingController.staffCreateWalkIn);
bookingRoutes.get("/", authMiddleware, roleMiddleware(staffRoles), bookingController.staffGetAll);
bookingRoutes.get("/:id", authMiddleware, roleMiddleware(staffRoles), bookingController.staffGetById);
bookingRoutes.put("/:id", authMiddleware, roleMiddleware(staffRoles), bookingController.staffUpdate);
bookingRoutes.post("/:id/cancel", authMiddleware, roleMiddleware(staffRoles), bookingController.staffCancel);
bookingRoutes.delete("/:id", authMiddleware, roleMiddleware(staffRoles), bookingController.staffDelete);

export default bookingRoutes;
