import { Router } from "express";
import paymentMethodController from "../controllers/PaymentMethodController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const paymentMethodRoutes = Router();

/**
 * @swagger
 * /api/payment-methods:
 *   get:
 *     summary: Get all payment methods
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payment methods
 */
paymentMethodRoutes.get("/", authMiddleware, paymentMethodController.getAllPaymentMethods);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   get:
 *     summary: Get payment method by ID
 *     tags: [PaymentMethods]
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
 *         description: Payment method details
 */
paymentMethodRoutes.get("/:id", authMiddleware, paymentMethodController.getPaymentMethodById);

/**
 * @swagger
 * /api/payment-methods:
 *   post:
 *     summary: Create a new payment method
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentMethodRequestDTO'
 *     responses:
 *       201:
 *         description: Payment method created
 */
paymentMethodRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), paymentMethodController.createPaymentMethod);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   put:
 *     summary: Update payment method
 *     tags: [PaymentMethods]
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
 *             $ref: '#/components/schemas/UpdatePaymentMethodRequestDTO'
 *     responses:
 *       200:
 *         description: Payment method updated
 */
paymentMethodRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), paymentMethodController.updatePaymentMethod);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   delete:
 *     summary: Delete payment method
 *     tags: [PaymentMethods]
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
 *         description: Payment method deleted
 */
paymentMethodRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), paymentMethodController.deletePaymentMethod);

export default paymentMethodRoutes;
