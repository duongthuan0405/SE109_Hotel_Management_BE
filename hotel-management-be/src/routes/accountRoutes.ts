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
accountRoutes.get("/", accountController.getMe);
accountRoutes.put("/", accountController.updateMe);
accountRoutes.put("/change-password", accountController.changePassword); 


export default accountRoutes;
