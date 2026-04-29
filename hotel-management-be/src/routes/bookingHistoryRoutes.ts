import { Router } from "express";
import bookingHistoryController from "../controllers/BookingHistoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();
const staffRoles = ["Admin", "Manager", "Receptionist"];

router.use(authMiddleware);

// router.post("/", roleMiddleware(staffRoles), bookingHistoryController.createBookingHistory);
router.get("/", roleMiddleware(staffRoles), bookingHistoryController.getAllBookingHistory);
router.get("/me", roleMiddleware(["Customer"]), bookingHistoryController.getMyHistory);
router.get("/:id", roleMiddleware(staffRoles), bookingHistoryController.getBookingHistoryById);
router.get("/booking/:bookingId", roleMiddleware(staffRoles), bookingHistoryController.getHistoryByBookingId);
router.delete("/:id", roleMiddleware(["Admin", "Manager"]), bookingHistoryController.deleteBookingHistory);

export default router;
