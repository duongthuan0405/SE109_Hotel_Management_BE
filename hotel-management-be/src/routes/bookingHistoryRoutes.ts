import { Router } from "express";
import bookingHistoryController from "../controllers/BookingHistoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", bookingHistoryController.createBookingHistory);
router.get("/", bookingHistoryController.getAllBookingHistory);
router.get("/:id", bookingHistoryController.getBookingHistoryById);
router.get("/booking/:bookingId", bookingHistoryController.getHistoryByBookingId);
router.delete("/:id", bookingHistoryController.deleteBookingHistory);

export default router;
