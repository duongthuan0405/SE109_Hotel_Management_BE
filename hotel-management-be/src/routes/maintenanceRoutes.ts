import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import maintenanceController from "../controllers/MaintenanceController.js";

const maintenanceRoutes = Router();

// Staff routes
/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Quản lý bảo trì và sửa chữa
 */

/**
 * @swagger
 * /api/maintenance/next-code:
 *   get:
 *     summary: Lấy mã phiếu bảo trì tiếp theo
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mã phiếu mới
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NextCodeResponseDTO'
 */
maintenanceRoutes.get("/next-code", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), maintenanceController.getNextCode);

/**
 * @swagger
 * /api/maintenance:
 *   post:
 *     summary: Tạo phiếu bảo trì mới (Staff)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMaintenanceRequestDTO'
 *     responses:
 *       201:
 *         description: Đã tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceResponse'
 */
maintenanceRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), maintenanceController.create);

/**
 * @swagger
 * /api/maintenance:
 *   get:
 *     summary: Lấy danh sách tất cả phiếu bảo trì
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phiếu bảo trì
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceListResponse'
 */
maintenanceRoutes.get("/", authMiddleware, maintenanceController.getAll);

/**
 * @swagger
 * /api/maintenance/guest/requests:
 *   get:
 *     summary: Khách hàng xem các yêu cầu bảo trì của mình
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceListResponse'
 */
maintenanceRoutes.get("/guest/requests", authMiddleware, roleMiddleware(["Customer"]), maintenanceController.guestGetRequests);

/**
 * @swagger
 * /api/maintenance/guest/request:
 *   post:
 *     summary: Khách hàng gửi yêu cầu bảo trì
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuestCreateMaintenanceRequestDTO'
 *     responses:
 *       201:
 *         description: Gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceResponse'
 */
maintenanceRoutes.post("/guest/request", authMiddleware, roleMiddleware(["Customer"]), maintenanceController.guestCreateRequest);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   get:
 *     summary: Lấy chi tiết phiếu bảo trì
 *     tags: [Maintenance]
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
 *         description: Thông tin chi tiết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceResponse'
 */
maintenanceRoutes.get("/:id", authMiddleware, maintenanceController.getById);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   put:
 *     summary: Cập nhật thông tin phiếu bảo trì
 *     tags: [Maintenance]
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
 *             $ref: '#/components/schemas/UpdateMaintenanceRequestDTO'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
maintenanceRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), maintenanceController.update);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   delete:
 *     summary: Xóa phiếu bảo trì
 *     tags: [Maintenance]
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
 *         description: Xóa thành công
 */
maintenanceRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), maintenanceController.delete);

export default maintenanceRoutes;
