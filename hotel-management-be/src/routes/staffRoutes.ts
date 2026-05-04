import { Router } from "express";
import staffController from "../controllers/StaffController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const staffRoutes = Router();

/**
 * @swagger
 * /api/staffs/me:
 *   get:
 *     summary: Get current staff profile
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffResponse'

 */
staffRoutes.get("/me", authMiddleware, roleMiddleware(["Admin", "Manager", "Staff"]), staffController.getMyProfile);

/**
 * @swagger
 * /api/staffs/me:
 *   put:
 *     summary: Update current staff profile
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStaffRequestDTO'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffResponse'

 */
staffRoutes.put("/me", authMiddleware, roleMiddleware(["Admin", "Manager", "Staff"]), staffController.updateMyProfile);

/**
 * @swagger
 * /api/staffs:
 *   get:
 *     summary: Get all staff members
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffListResponse'

 */
staffRoutes.get("/", authMiddleware, roleMiddleware(["Admin"]), staffController.getAllStaffs);

/**
 * @swagger
 * /api/staffs/{id}:
 *   get:
 *     summary: Get staff by ID
 *     tags: [Staff]
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
 *         description: Staff details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffResponse'

 */
staffRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin"]), staffController.getStaffById);

/**
 * @swagger
 * /api/staffs:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStaffRequestDTO'
 *     responses:
 *       201:
 *         description: Staff created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffResponse'

 */
staffRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), staffController.createStaff);

/**
 * @swagger
 * /api/staffs/{id}:
 *   put:
 *     summary: Update staff member
 *     tags: [Staff]
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
 *             $ref: '#/components/schemas/UpdateStaffRequestDTO'
 *     responses:
 *       200:
 *         description: Staff updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffResponse'

 */
staffRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), staffController.updateStaff);

/**
 * @swagger
 * /api/staffs/{id}:
 *   delete:
 *     summary: Delete staff member
 *     tags: [Staff]
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
 *         description: Staff deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffBaseResponse'

 */
staffRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), staffController.deleteStaff);

export default staffRoutes;
