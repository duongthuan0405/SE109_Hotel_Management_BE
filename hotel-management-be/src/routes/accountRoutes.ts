import { Router } from "express";
import accountController from "../controllers/AccountController.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const accountRoutes = Router();

// accountRoutes.post("/", roleMiddleware(["Admin"]), accountController.createAccount);
// accountRoutes.get("/", roleMiddleware(["Admin"]), accountController.getAllAccounts);
// accountRoutes.get("/:id", roleMiddleware(["Admin"]), accountController.getAccountById);
// accountRoutes.put("/:id", roleMiddleware(["Admin"]), accountController.updateAccount);
// accountRoutes.delete("/:id", roleMiddleware(["Admin"]), accountController.deleteAccount);

// API cá nhân (Self-service)
accountRoutes.get("/me", accountController.getMe);
accountRoutes.put("/me", accountController.updateMe);
accountRoutes.put("/me/change-password", accountController.changePassword); 


export default accountRoutes;
