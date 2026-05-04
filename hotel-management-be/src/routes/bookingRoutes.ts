import { Router } from "express";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import bookingController from "../controllers/BookingController.js";

const bookingRoutes = Router();

/**
 * @swagger
 * /api/bookings/customer:
 *   post:
 *     summary: Create a booking (Customer)
 *     tags: [Booking (Customer)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequestDTO'
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'

 */
bookingRoutes.post("/customer/", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerCreate);

/**
 * @swagger
 * /api/bookings/customer:
 *   get:
 *     summary: Get all bookings for current customer
 *     tags: [Booking (Customer)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingListResponse'

 */
bookingRoutes.get("/customer/", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerGetAll);

/**
 * @swagger
 * /api/bookings/customer/{id}:
 *   get:
 *     summary: Get booking by ID (Customer)
 *     tags: [Booking (Customer)]
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
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'

 */
bookingRoutes.get("/customer/:id", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerGetById);

/**
 * @swagger
 * /api/bookings/customer/{id}:
 *   put:
 *     summary: Update booking (Customer)
 *     tags: [Booking (Customer)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookingRequestDTO'
 *     responses:
 *       200:
 *         description: Booking updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'

 */
bookingRoutes.put("/customer/:id", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerUpdate);

/**
 * @swagger
 * /api/bookings/customer/{id}/cancel:
 *   post:
 *     summary: Cancel booking (Customer)
 *     tags: [Booking (Customer)]
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
 *         description: Booking cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingBaseResponse'

 */
bookingRoutes.post("/customer/:id/cancel", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerCancel);

/**
 * @swagger
 * /api/bookings/customer/{id}:
 *   delete:
 *     summary: Delete booking record (Customer)
 *     tags: [Booking (Customer)]
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
 *         description: Booking deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingBaseResponse'

 */
bookingRoutes.delete("/customer/:id", authMiddleware, roleMiddleware(["Customer"]), bookingController.customerDelete);

const staffRoles = ["Admin", "Manager", "Staff"];

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking (Staff)
 *     tags: [Booking (Staff)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequestDTO'
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'

 */
bookingRoutes.post("/", authMiddleware, roleMiddleware(staffRoles), bookingController.staffCreate);

/**
 * @swagger
 * /api/bookings/walk-in:
 *   post:
 *     summary: Create a walk-in booking (Staff)
 *     tags: [Booking (Staff)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequestDTO'
 *     responses:
 *       201:
 *         description: Walk-in booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'

 */
bookingRoutes.post("/walk-in", authMiddleware, roleMiddleware(staffRoles), bookingController.staffCreateWalkIn);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (Staff)
 *     tags: [Booking (Staff)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingListResponse'

 */
bookingRoutes.get("/", authMiddleware, roleMiddleware(staffRoles), bookingController.staffGetAll);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID (Staff)
 *     tags: [Booking (Staff)]
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
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'

 */
bookingRoutes.get("/:id", authMiddleware, roleMiddleware(staffRoles), bookingController.staffGetById);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update booking (Staff)
 *     tags: [Booking (Staff)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookingRequestDTO'
 *     responses:
 *       200:
 *         description: Booking updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'

 */
bookingRoutes.put("/:id", authMiddleware, roleMiddleware(staffRoles), bookingController.staffUpdate);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel booking (Staff)
 *     tags: [Booking (Staff)]
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
 *         description: Booking cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingBaseResponse'

 */
bookingRoutes.post("/:id/cancel", authMiddleware, roleMiddleware(staffRoles), bookingController.staffCancel);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete booking record (Staff)
 *     tags: [Booking (Staff)]
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
 *         description: Booking deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingBaseResponse'

 */
bookingRoutes.delete("/:id", authMiddleware, roleMiddleware(staffRoles), bookingController.staffDelete);

export default bookingRoutes;
