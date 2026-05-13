import { Router } from "express";
import serviceUsageController from "../controllers/ServiceUsageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const serviceUsageRoutes = Router();

/**
 * @swagger
 * /api/service-usages:
 *   get:
 *     summary: Get all service usage records
 *     tags: [ServiceUsage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of service usages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageListResponse'

 */
serviceUsageRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), serviceUsageController.getAllServiceUsages);

/**
 * @swagger
 * /api/service-usages/me:
 *   get:
 *     summary: Get current customer service usage
 *     tags: [ServiceUsage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My service usages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageListResponse'

 */
serviceUsageRoutes.get("/me", authMiddleware, serviceUsageController.getMyServiceUsages);

/**
 * @swagger
 * /api/service-usages/customer/order:
 *   post:
 *     summary: Customer order a service
 *     tags: [ServiceUsage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceUsageRequestDTO'
 *     responses:
 *       201:
 *         description: Service ordered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageResponse'

 */
serviceUsageRoutes.post("/customer/order", authMiddleware, serviceUsageController.customerOrderService);

/**
 * @swagger
 * /api/service-usages/customer/{customerId}:
 *   get:
 *     summary: Get service usage by customer ID
 *     tags: [ServiceUsage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of service usages for customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageListResponse'

 */
serviceUsageRoutes.get("/customer/:customerId", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), serviceUsageController.getServiceUsagesByCustomerId);

/**
 * @swagger
 * /api/service-usages/{id}:
 *   get:
 *     summary: Get service usage record by ID
 *     tags: [ServiceUsage]
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
 *         description: Service usage details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageResponse'

 */
serviceUsageRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin", "Manager", "Receptionist"]), serviceUsageController.getServiceUsageById);

/**
 * @swagger
 * /api/service-usages:
 *   post:
 *     summary: Create a service usage record (Staff)
 *     tags: [ServiceUsage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceUsageRequestDTO'
 *     responses:
 *       201:
 *         description: Service usage record created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageResponse'

 */
serviceUsageRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageController.createServiceUsage);

/**
 * @swagger
 * /api/service-usages/{id}:
 *   put:
 *     summary: Update service usage record
 *     tags: [ServiceUsage]
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
 *             $ref: '#/components/schemas/UpdateServiceUsageRequestDTO'
 *     responses:
 *       200:
 *         description: Service usage record updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageResponse'

 */
serviceUsageRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), serviceUsageController.updateServiceUsage);

/**
 * @swagger
 * /api/service-usages/{id}:
 *   delete:
 *     summary: Delete service usage record
 *     tags: [ServiceUsage]
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
 *         description: Service usage record deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageBaseResponse'

 */
serviceUsageRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), serviceUsageController.deleteServiceUsage);

export default serviceUsageRoutes;
