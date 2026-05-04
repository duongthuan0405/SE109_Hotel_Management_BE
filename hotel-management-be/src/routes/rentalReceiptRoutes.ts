import { Router } from "express";
import rentalReceiptController from "../controllers/RentalReceiptController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const rentalReceiptRoutes = Router();

/**
 * @swagger
 * /api/rental-receipts:
 *   get:
 *     summary: Get all rental receipts
 *     tags: [RentalReceipts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rental receipts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalReceiptListResponse'

 */
rentalReceiptRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Manager", "Staff"]), rentalReceiptController.getAllRentalReceipts);

/**
 * @swagger
 * /api/rental-receipts/{id}:
 *   get:
 *     summary: Get rental receipt by ID
 *     tags: [RentalReceipts]
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
 *         description: Rental receipt details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalReceiptResponse'

 */
rentalReceiptRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin", "Manager", "Staff"]), rentalReceiptController.getRentalReceiptById);

/**
 * @swagger
 * /api/rental-receipts:
 *   post:
 *     summary: Create a new rental receipt (Check-in)
 *     tags: [RentalReceipts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRentalReceiptRequestDTO'
 *     responses:
 *       201:
 *         description: Rental receipt created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalReceiptResponse'

 */
rentalReceiptRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Staff"]), rentalReceiptController.createRentalReceipt);

/**
 * @swagger
 * /api/rental-receipts/{id}:
 *   put:
 *     summary: Update rental receipt
 *     tags: [RentalReceipts]
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
 *             $ref: '#/components/schemas/UpdateRentalReceiptRequestDTO'
 *     responses:
 *       200:
 *         description: Rental receipt updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalReceiptResponse'

 */
rentalReceiptRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Staff"]), rentalReceiptController.updateRentalReceipt);

/**
 * @swagger
 * /api/rental-receipts/{id}:
 *   delete:
 *     summary: Delete rental receipt
 *     tags: [RentalReceipts]
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
 *         description: Rental receipt deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalReceiptBaseResponse'

 */
rentalReceiptRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), rentalReceiptController.deleteRentalReceipt);

export default rentalReceiptRoutes;
