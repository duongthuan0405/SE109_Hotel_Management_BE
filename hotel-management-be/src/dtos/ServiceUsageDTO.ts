// Request DTOs (field tiếng Việt, tương thích client cũ)

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateServiceUsageRequestDTO:
 *       type: object
 *       required:
 *         - PhieuThuePhong
 *         - DichVu
 *         - SoLuong
 *         - DonGia
 *         - ThanhTien
 *       properties:
 *         PhieuThuePhong:
 *           type: string
 *         DichVu:
 *           type: string
 *         SoLuong:
 *           type: number
 *         NgaySDV:
 *           type: string
 *           format: date-time
 *         DonGia:
 *           type: number
 *         ThanhTien:
 *           type: number
 */
export type CreateServiceUsageRequestDTO = {
  PhieuThuePhong: string; // ID phiếu thuê phòng
  DichVu: string; // ID dịch vụ
  SoLuong: number;
  NgaySDV?: string; // ISO String, optional
  DonGia: number;
  ThanhTien: number;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateServiceUsageRequestDTO:
 *       type: object
 *       properties:
 *         SoLuong:
 *           type: number
 *         TrangThai:
 *           type: string
 *           enum: [Pending, In_Progress, Completed, Cancelled]
 */
export type UpdateServiceUsageRequestDTO = {
  SoLuong?: number;
  TrangThai?: string;
};

// Response DTOs

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceUsageDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaSDDV:
 *           type: string
 *         PhieuThuePhong:
 *           type: object
 *         DichVu:
 *           type: object
 *         SoLuong:
 *           type: number
 *         DonGia:
 *           type: number
 *         ThanhTien:
 *           type: number
 *         ThoiDiemYeuCau:
 *           type: string
 *           format: date-time
 *         TrangThai:
 *           type: string
 */
export type ServiceUsageDataDTO = {
  _id: string;
  MaSDDV: string;
  PhieuThuePhong: any; // Populated RentalSlip hoặc ID
  DichVu: any; // Populated Service hoặc ID
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
  ThoiDiemYeuCau: Date;
  TrangThai: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceUsageResponseDTO:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/ServiceUsageDataDTO'
 */
export type ServiceUsageResponseDTO = {
  success: boolean;
  message: string;
  data: ServiceUsageDataDTO;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceUsageListResponseDTO:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ServiceUsageDataDTO'
 */
export type ServiceUsageListResponseDTO = {
  success: boolean;
  message: string;
  data: ServiceUsageDataDTO[];
};
