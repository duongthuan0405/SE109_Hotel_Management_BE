import { Router } from "express";
import invoiceController from "../controllers/InvoiceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const invoiceRoutes = Router();

// Everyone staff can read/create/preview invoices (Cashier, Manager, Admin)
invoiceRoutes.get("/preview", authMiddleware, invoiceController.getPreview);
invoiceRoutes.post("/checkout", authMiddleware, invoiceController.createCheckoutInvoice);
invoiceRoutes.post("/", authMiddleware, invoiceController.createInvoice);
invoiceRoutes.get("/", authMiddleware, invoiceController.getAllInvoices);
invoiceRoutes.get("/:id", authMiddleware, invoiceController.getInvoiceById);

// Update status or delete: only Admin/Manager might be able to modify past invoices
invoiceRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Manager"]), invoiceController.updateInvoice);
invoiceRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin", "Manager"]), invoiceController.deleteInvoice);

export default invoiceRoutes;
