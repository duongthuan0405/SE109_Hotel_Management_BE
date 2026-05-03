import { Router } from "express";
import bookingHistoryController from "../controllers/BookingHistoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();
const staffRoles = ["Admin", "Manager", "Receptionist"];

router.use(authMiddleware);

/**
 * @swagger
 * /api/booking-history:
 *   get:
 *     summary: Get all booking history records
 *     tags: [BookingHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of booking history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingHistoryListResponse'

 */
router.get("/", roleMiddleware(staffRoles), bookingHistoryController.getAllBookingHistory);

/**
 * @swagger
 * /api/booking-history/me:
 *   get:
 *     summary: Get current customer booking history
 *     tags: [BookingHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My booking history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingHistoryListResponse'

 */
router.get("/me", roleMiddleware(["Customer"]), bookingHistoryController.getMyHistory);

/**
 * @swagger
 * /api/booking-history/{id}:
 *   get:
 *     summary: Get booking history by ID
 *     tags: [BookingHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking history details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingHistoryResponse'

 */
router.get("/:id", roleMiddleware(staffRoles), bookingHistoryController.getBookingHistoryById);

/**
 * @swagger
 * /api/booking-history/booking/{bookingId}:
 *   get:
 *     summary: Get history for a specific booking
 *     tags: [BookingHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of history records for booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingHistoryListResponse'

 */
router.get("/booking/:bookingId", roleMiddleware(staffRoles), bookingHistoryController.getHistoryByBookingId);

/**
 * @swagger
 * /api/booking-history/{id}:
 *   delete:
 *     summary: Delete history record
 *     tags: [BookingHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: History record deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingHistoryBaseResponse'

 */
router.delete("/:id", roleMiddleware(["Admin", "Manager"]), bookingHistoryController.deleteBookingHistory);

export default router;
