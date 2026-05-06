import express, { type Request, type Response } from "express";
import { errorHandler } from "./middlewares/errorMiddleware.js";

import env from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import roomTypeRoutes from "./routes/roomTypeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import rentalReceiptRoutes from "./routes/rentalReceiptRoutes.js";
import serviceUsageRoutes from "./routes/serviceUsageRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import paymentMethodRoutes from "./routes/paymentMethodRoutes.js";
import bookingHistoryRoutes from "./routes/bookingHistoryRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import setupSwagger from "./config/swagger.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import serviceUsageHistoryRoutes from "./routes/serviceUsageHistoryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();
setupSwagger(app);
const PORT = env.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/rental-receipts", rentalReceiptRoutes);
app.use("/api/service-usages", serviceUsageRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/booking-history", bookingHistoryRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/service-usage-history", serviceUsageHistoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello từ Express + TypeScript!");
});

app.use(errorHandler);



if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

export default app;
