import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import positionController from "../controllers/PositionController.js";

const positionRoutes = Router();

// Chỉ Admin được CRUD chức vụ (master data)
/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: Quản lý chức vụ nhân viên
 */

/**
 * @swagger
 * /api/positions:
 *   get:
 *     summary: Lấy danh sách tất cả chức vụ
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách chức vụ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PositionListResponse'
 */
positionRoutes.get("/", authMiddleware, roleMiddleware(["Admin"]), positionController.getAll);

/**
 * @swagger
 * /api/positions/{id}:
 *   get:
 *     summary: Lấy chi tiết chức vụ
 *     tags: [Positions]
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
 *               $ref: '#/components/schemas/PositionResponse'
 */
positionRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin"]), positionController.getById);

/**
 * @swagger
 * /api/positions:
 *   post:
 *     summary: Tạo chức vụ mới
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePositionRequestDTO'
 *     responses:
 *       201:
 *         description: Đã tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PositionResponse'
 */
positionRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), positionController.create);

/**
 * @swagger
 * /api/positions/{id}:
 *   put:
 *     summary: Cập nhật thông tin chức vụ
 *     tags: [Positions]
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
 *             $ref: '#/components/schemas/UpdatePositionRequestDTO'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
positionRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), positionController.update);

/**
 * @swagger
 * /api/positions/{id}:
 *   delete:
 *     summary: Xóa chức vụ
 *     tags: [Positions]
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
positionRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), positionController.delete);

export default positionRoutes;
