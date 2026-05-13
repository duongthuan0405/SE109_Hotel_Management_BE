import { Router } from "express";
import accountController from "../controllers/AccountController.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const accountRoutes = Router();

/**
 * @swagger
 * /api/accounts/me:
 *   get:
 *     summary: Get current logged in account details
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountResponse'

 */
accountRoutes.get("/me", authMiddleware, accountController.getMe);

/**
 * @swagger
 * /api/accounts/me/change-password:
 *   put:
 *     summary: Change current user password
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequestDTO'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountBaseResponse'

 */
accountRoutes.put("/me/change-password", authMiddleware, accountController.changePassword);

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountRequestDTO'
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountResponse'

 */
accountRoutes.post("/", authMiddleware, roleMiddleware(["Admin"]), accountController.createAccount);

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountListResponse'

 */
accountRoutes.get("/", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), accountController.getAllAccounts);

/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
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
 *         description: Account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountResponse'

 */
accountRoutes.get("/:id", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), accountController.getAccountById);

/**
 * @swagger
 * /api/accounts/{id}:
 *   put:
 *     summary: Update account (Role only)
 *     tags: [Accounts]
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
 *             $ref: '#/components/schemas/UpdateAccountRequestDTO'
 *     responses:
 *       200:
 *         description: Account updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountResponse'

 */
accountRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin"]), accountController.updateAccount);

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Delete account
 *     tags: [Accounts]
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
 *         description: Account deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountBaseResponse'

 */
accountRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), accountController.deleteAccount);


export default accountRoutes;
