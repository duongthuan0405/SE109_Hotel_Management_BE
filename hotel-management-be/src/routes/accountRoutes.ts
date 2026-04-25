import { Router } from "express";
import accountController from "../controllers/AccountController.js";

const accountRoutes = Router();

accountRoutes.post("/", accountController.createAccount);
accountRoutes.get("/", accountController.getAllAccounts);
accountRoutes.get("/:id", accountController.getAccountById);
accountRoutes.put("/:id", accountController.updateAccount);
accountRoutes.put("/:id/change-password", accountController.changePassword);
accountRoutes.delete("/:id", accountController.deleteAccount);

export default accountRoutes;
