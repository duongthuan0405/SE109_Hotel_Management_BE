import express, { type Request, type Response } from "express";
import env from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import roomTypeRoutes from "./routes/roomTypeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();
const PORT = env.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello từ Express + TypeScript!");
});

app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

export default app;
