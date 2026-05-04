import { Router } from "express";
import invoiceController from "../controllers/InvoiceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const invoiceRoutes = Router();
const staffRoles = ["Admin", "Manager", "Staff"];

/**
 * @swagger
 * /api/invoices/preview:
 *   get:
 *     summary: Preview invoice for a rental slip
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rentalSlipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice preview details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreviewInvoiceResponse'

 */
invoiceRoutes.get("/preview", authMiddleware, roleMiddleware(staffRoles), invoiceController.getPreview);

/**
 * @swagger
 * /api/invoices/checkout:
 *   post:
 *     summary: Create checkout invoice (Final payment)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCheckoutInvoiceRequestDTO'
 *     responses:
 *       201:
 *         description: Checkout invoice created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceResponse'

 */
invoiceRoutes.post("/checkout", authMiddleware, roleMiddleware(staffRoles), invoiceController.createCheckoutInvoice);

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a custom invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvoiceRequestDTO'
 *     responses:
 *       201:
 *         description: Invoice created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceResponse'

 */
invoiceRoutes.post("/", authMiddleware, roleMiddleware(staffRoles), invoiceController.createInvoice);

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invoices
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceListResponse'

 */
invoiceRoutes.get("/", authMiddleware, roleMiddleware(staffRoles), invoiceController.getAllInvoices);

/**
 * @swagger
 * /api/invoices/me:
 *   get:
 *     summary: Get current customer invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My invoices
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceListResponse'

 */
invoiceRoutes.get("/me", authMiddleware, roleMiddleware(["Customer"]), invoiceController.getMyInvoices);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
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
 *         description: Invoice details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceResponse'

 */
invoiceRoutes.get("/:id", authMiddleware, roleMiddleware([...staffRoles, "Customer"]), invoiceController.getInvoiceById);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update invoice
 *     tags: [Invoices]
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
 *         description: Invoice updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceResponse'

 */
invoiceRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Manager"]), invoiceController.updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete invoice
 *     tags: [Invoices]
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
 *         description: Invoice deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceBaseResponse'

 */
invoiceRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin", "Manager"]), invoiceController.deleteInvoice);

export default invoiceRoutes;
