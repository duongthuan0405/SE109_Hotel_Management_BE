import { type Request, type Response, type NextFunction } from "express";
import { getDashboardDataUseCase } from "../useCases/index.js";
import { type DashboardDataDTO } from "../dtos/DashboardDTO.js";
import { type GetDashboardDataOutput } from "../useCases/implementations/GetDashboardDataUseCase.js";

const mapToDTO = (data: GetDashboardDataOutput): DashboardDataDTO => ({
  TongQuan: {
    TongDoanhThu: data.summary.totalRevenue,
    TongDatPhong: data.summary.totalBookings,
    TongKhachHang: data.summary.totalCustomers,
    LuotThueDangHoatDong: data.summary.activeRentals,
  },
  ThongKeDoanhThu: data.revenueStats.map(r => ({
    Ngay: r.date,
    SoTien: r.amount,
  })),
  MatDoPhong: data.roomOccupancy.map(r => ({
    TrangThai: r.status,
    SoLuong: r.count,
  })),
  TopDichVu: data.topServices.map(s => ({
    TenDichVu: s.name,
    SoLuotDung: s.count,
    DoanhThu: s.revenue,
  })),
});

const dashboardController = {
  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate as string) 
        : new Date(new Date().setDate(new Date().getDate() - 30));

      const stats = await getDashboardDataUseCase.execute({
        revenueStartDate: startDate,
        revenueEndDate: endDate,
      });

      res.status(200).json({
        success: true,
        message: "Lấy dữ liệu thống kê thành công",
        data: mapToDTO(stats),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default dashboardController;
