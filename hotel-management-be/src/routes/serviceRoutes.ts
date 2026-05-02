import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import serviceController from "../controllers/ServiceController.js";

const serviceRoutes = Router();

const allRoles = ["Admin", "Manager", "Receptionist", "Customer"];
const adminRoles = ["Admin", "Manager"];

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 */
serviceRoutes.get("/", authMiddleware, roleMiddleware(allRoles), serviceController.getAll);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
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
 *         description: Service details
 */
serviceRoutes.get("/:id", authMiddleware, roleMiddleware(allRoles), serviceController.getById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequestDTO'
 *     responses:
 *       201:
 *         description: Service created
 */
serviceRoutes.post("/", authMiddleware, roleMiddleware(adminRoles), serviceController.create);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Services]
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
 *             $ref: '#/components/schemas/UpdateServiceRequestDTO'
 *     responses:
 *       200:
 *         description: Service updated
 */
serviceRoutes.put("/:id", authMiddleware, roleMiddleware(adminRoles), serviceController.update);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Services]
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
 *         description: Service deleted
 */
serviceRoutes.delete("/:id", authMiddleware, roleMiddleware(adminRoles), serviceController.delete);

export default serviceRoutes;
