import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import dashboardController from "../controllers/DashboardController.js";

const dashboardRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardSummary:
 *       type: object
 *       properties:
 *         TongDoanhThu:
 *           type: number
 *         TongDatPhong:
 *           type: integer
 *         TongKhachHang:
 *           type: integer
 *         LuotThueDangHoatDong:
 *           type: integer
 *     RevenueStat:
 *       type: object
 *       properties:
 *         Ngay:
 *           type: string
 *           format: date
 *         SoTien:
 *           type: number
 *     RoomOccupancyStat:
 *       type: object
 *       properties:
 *         TrangThai:
 *           type: string
 *         SoLuong:
 *           type: integer
 *     TopServiceStat:
 *       type: object
 *       properties:
 *         TenDichVu:
 *           type: string
 *         SoLuotDung:
 *           type: integer
 *         DoanhThu:
 *           type: number
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             TongQuan:
 *               $ref: '#/components/schemas/DashboardSummary'
 *             ThongKeDoanhThu:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RevenueStat'
 *             MatDoPhong:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoomOccupancyStat'
 *             TopDichVu:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TopServiceStat'
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Lấy dữ liệu thống kê tổng hợp (Doanh thu, Mật độ phòng, v.v.)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu thống kê doanh thu (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc thống kê doanh thu (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Dữ liệu thống kê chi tiết cho Dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 */
dashboardRoutes.get("/stats", authMiddleware, roleMiddleware(["Admin", "Manager"]), dashboardController.getStats);

export default dashboardRoutes;
