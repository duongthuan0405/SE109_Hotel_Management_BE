export interface DashboardSummaryDTO {
  TongDoanhThu: number;
  TongDatPhong: number;
  TongKhachHang: number;
  LuotThueDangHoatDong: number;
}

export interface RevenueStatDTO {
  Ngay: Date;
  SoTien: number;
}


export interface RoomOccupancyStatDTO {
  TrangThai: string;
  SoLuong: number;
}

export interface TopServiceStatDTO {
  TenDichVu: string;
  SoLuotDung: number;
  DoanhThu: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardSummaryDTO:
 *       type: object
 *       properties:
 *         TongDoanhThu:
 *           type: number
 *         TongDatPhong:
 *           type: number
 *         TongKhachHang:
 *           type: number
 *         LuotThueDangHoatDong:
 *           type: number
 *
 *     RevenueStatDTO:
 *       type: object
 *       properties:
 *         Ngay:
 *           type: string
 *           format: date-time
 *         SoTien:
 *           type: number
 *
 *     RoomOccupancyStatDTO:
 *       type: object
 *       properties:
 *         TrangThai:
 *           type: string
 *         SoLuong:
 *           type: number
 *
 *     TopServiceStatDTO:
 *       type: object
 *       properties:
 *         TenDichVu:
 *           type: string
 *         SoLuotDung:
 *           type: number
 *         DoanhThu:
 *           type: number
 *
 *     DashboardDataDTO:
 *       type: object
 *       properties:
 *         TongQuan:
 *           $ref: '#/components/schemas/DashboardSummaryDTO'
 *         ThongKeDoanhThu:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RevenueStatDTO'
 *         MatDoPhong:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoomOccupancyStatDTO'
 *         TopDichVu:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TopServiceStatDTO'
 */
export interface DashboardDataDTO {
  TongQuan: DashboardSummaryDTO;
  ThongKeDoanhThu: RevenueStatDTO[];
  MatDoPhong: RoomOccupancyStatDTO[];
  TopDichVu: TopServiceStatDTO[];
}

