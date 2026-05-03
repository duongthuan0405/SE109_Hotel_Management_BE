import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import roomTypeController from "../controllers/RoomTypeController.js";

const roomTypeRoutes = Router();

/**
 * @swagger
 * /api/room-types:
 *   get:
 *     summary: Get all room types
 *     tags: [RoomTypes]
 *     responses:
 *       200:
 *         description: List of room types
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomTypeListResponse'

 */
roomTypeRoutes.get("/", roomTypeController.getAllRoomTypes);

/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     summary: Get room type by ID
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomTypeResponse'

 */
roomTypeRoutes.get("/:id", roomTypeController.getRoomTypeById);

/**
 * @swagger
 * /api/room-types:
 *   post:
 *     summary: Create a new room type
 *     tags: [RoomTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoomTypeRequestDTO'
 *     responses:
 *       201:
 *         description: Room type created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomTypeResponse'

 */
roomTypeRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), roomTypeController.createRoomType);

/**
 * @swagger
 * /api/room-types/{id}:
 *   put:
 *     summary: Update room type
 *     tags: [RoomTypes]
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
 *             $ref: '#/components/schemas/UpdateRoomTypeRequestDTO'
 *     responses:
 *       200:
 *         description: Room type updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomTypeResponse'

 */
roomTypeRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), roomTypeController.updateRoomType);

/**
 * @swagger
 * /api/room-types/{id}:
 *   delete:
 *     summary: Delete room type
 *     tags: [RoomTypes]
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
 *         description: Room type deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomTypeBaseResponse'

 */
roomTypeRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), roomTypeController.deleteRoomType);

export default roomTypeRoutes;
