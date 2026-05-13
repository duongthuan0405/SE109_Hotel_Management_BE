import express from "express";
import momoController from "../controllers/MomoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Momo
 *   description: MoMo E-Wallet Payment integration
 */

/**
 * @swagger
 * /api/momo/create-payment:
 *   post:
 *     summary: Start a MoMo payment session for a booking deposit
 *     tags: [Momo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CreateBookingRequestDTO'
 *               - type: object
 *                 properties:
 *                   frontendUrl:
 *                     type: string
 *                     description: "Override generic frontend URL for success routing"
 *     responses:
 *       200:
 *         description: Payment initiated successfully, returns payUrl
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     payUrl:
 *                       type: string
 *                     orderId:
 *                       type: string
 *                     bookingId:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.post("/create-payment", authMiddleware, momoController.createPayment);

/**
 * @swagger
 * /api/momo/verify-redirect:
 *   get:
 *     summary: Confirm payment on client landing page redirection
 *     tags: [Momo]
 *     parameters:
 *       - in: query
 *         name: signature
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: resultCode
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: extraData
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Verification complete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 */
router.get("/verify-redirect", momoController.verifyRedirect);

/**
 * @swagger
 * /api/momo/callback:
 *   post:
 *     summary: IPN Webhook handler invoked directly by MoMo servers to confirm capture
 *     tags: [Momo]
 *     description: Server-to-server silent callback. Secures against lost connections.
 *     responses:
 *       204:
 *         description: Success acknowledgement
 */
router.post("/callback", momoController.handleCallback);

export default router;
