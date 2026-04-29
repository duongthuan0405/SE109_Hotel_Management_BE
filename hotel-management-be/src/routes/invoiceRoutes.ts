import { Router } from "express";
import invoiceController from "../controllers/InvoiceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const invoiceRoutes = Router();
const staffRoles = ["Admin", "Manager", "Receptionist"];

// Everyone staff can read/create/preview invoices (Cashier, Manager, Admin)
invoiceRoutes.get("/preview", authMiddleware, roleMiddleware(staffRoles), invoiceController.getPreview);
invoiceRoutes.post("/checkout", authMiddleware, roleMiddleware(staffRoles), invoiceController.createCheckoutInvoice);
invoiceRoutes.post("/", authMiddleware, roleMiddleware(staffRoles), invoiceController.createInvoice);
invoiceRoutes.get("/", authMiddleware, roleMiddleware(staffRoles), invoiceController.getAllInvoices);
invoiceRoutes.get("/me", authMiddleware, roleMiddleware(["Customer"]), invoiceController.getMyInvoices);
invoiceRoutes.get("/:id", authMiddleware, roleMiddleware([...staffRoles, "Customer"]), invoiceController.getInvoiceById);

// Update status or delete: only Admin/Manager might be able to modify past invoices
invoiceRoutes.put("/:id", authMiddleware, roleMiddleware(["Admin", "Manager"]), invoiceController.updateInvoice);
invoiceRoutes.delete("/:id", authMiddleware, roleMiddleware(["Admin", "Manager"]), invoiceController.deleteInvoice);

export default invoiceRoutes;
