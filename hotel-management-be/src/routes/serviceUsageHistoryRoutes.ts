import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import serviceUsageHistoryController from "../controllers/ServiceUsageHistoryController.js";

const serviceUsageHistoryRoutes = Router();

// /usage/:serviceUsageId phải đặt TRƯỚC /:id để tránh Express nhầm "usage" thành id
/**
 * @swagger
 * tags:
 *   name: ServiceUsageHistory
 *   description: Lịch sử sử dụng dịch vụ
 */

/**
 * @swagger
 * /api/service-usage-history/usage/{serviceUsageId}:
 *   get:
 *     summary: Lấy lịch sử sử dụng cho một lần dùng dịch vụ cụ thể
 *     tags: [ServiceUsageHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceUsageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách lịch sử
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageHistoryListResponse'
 */
serviceUsageHistoryRoutes.get("/usage/:serviceUsageId", authMiddleware, roleMiddleware(["Admin", "Staff"]), serviceUsageHistoryController.getByServiceUsageId);

/**
 * @swagger
 * /api/service-usage-history:
 *   get:
 *     summary: Lấy tất cả lịch sử sử dụng dịch vụ
 *     tags: [ServiceUsageHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lịch sử
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageHistoryListResponse'
 */
serviceUsageHistoryRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Staff"]), serviceUsageHistoryController.getAll);

/**
 * @swagger
 * /api/service-usage-history/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một lịch sử sử dụng dịch vụ
 *     tags: [ServiceUsageHistory]
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
 *               $ref: '#/components/schemas/ServiceUsageHistoryResponse'
 */
serviceUsageHistoryRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin", "Staff"]), serviceUsageHistoryController.getById);

/**
 * @swagger
 * /api/service-usage-history:
 *   post:
 *     summary: Tạo lịch sử sử dụng dịch vụ mới
 *     tags: [ServiceUsageHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceUsageHistoryRequestDTO'
 *     responses:
 *       201:
 *         description: Đã tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageHistoryResponse'
 */
serviceUsageHistoryRoutes.post("/", authMiddleware, roleMiddleware(["Admin", "Staff"]), serviceUsageHistoryController.create);

/**
 * @swagger
 * /api/service-usage-history/{id}:
 *   put:
 *     summary: Cập nhật trạng thái lịch sử sử dụng dịch vụ (Logic shift trạng thái)
 *     tags: [ServiceUsageHistory]
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
 *             $ref: '#/components/schemas/UpdateServiceUsageHistoryRequestDTO'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceUsageHistoryResponse'
 */
serviceUsageHistoryRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Staff"]), serviceUsageHistoryController.update);

/**
 * @swagger
 * /api/service-usage-history/{id}:
 *   delete:
 *     summary: Xóa lịch sử sử dụng dịch vụ
 *     tags: [ServiceUsageHistory]
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
serviceUsageHistoryRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), serviceUsageHistoryController.delete);

export default serviceUsageHistoryRoutes;
