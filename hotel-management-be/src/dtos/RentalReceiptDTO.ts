import { type RentalSlip } from "../models/RentalSlip.js";

// Request DTOs (Tiếng Việt để khớp với client cũ)
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRentalReceiptRequestDTO:
 *       type: object
 *       required:
 *         - DatPhong
 *         - Phong
 *         - NgayTraDuKien
 *         - SoKhachThucTe
 *         - DonGiaSauDieuChinh
 *       properties:
 *         DatPhong:
 *           type: string
 *         Phong:
 *           type: string
 *         NgayTraDuKien:
 *           type: string
 *           format: date-time
 *         SoKhachThucTe:
 *           type: number
 *         DonGiaSauDieuChinh:
 *           type: number
 */
export type CreateRentalReceiptRequestDTO = {
  DatPhong: string;
  Phong: string;
  NgayTraDuKien: string; // ISO String
  SoKhachThucTe: number;
  DonGiaSauDieuChinh: number;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRentalReceiptRequestDTO:
 *       type: object
 *       properties:
 *         NgayTraDuKien:
 *           type: string
 *           format: date-time
 *         SoKhachThucTe:
 *           type: number
 *         DonGiaSauDieuChinh:
 *           type: number
 *         TrangThai:
 *           type: string
 *           enum: [CheckedIn, CheckedOut, Cancelled]
 */
export type UpdateRentalReceiptRequestDTO = {
  NgayTraDuKien?: string;
  SoKhachThucTe?: number;
  DonGiaSauDieuChinh?: number;
  TrangThai?: string;
};

// Response DTOs
/**
 * @swagger
 * components:
 *   schemas:
 *     RentalReceiptDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaPTP:
 *           type: string
 *         DatPhong:
 *           type: object
 *         Phong:
 *           type: object
 *         NgayNhanPhong:
 *           type: string
 *           format: date-time
 *         NgayTraDuKien:
 *           type: string
 *           format: date-time
 *         SoKhachThucTe:
 *           type: number
 *         DonGiaSauDieuChinh:
 *           type: number
 *         NhanVienCheckIn:
 *           type: object
 *         TrangThai:
 *           type: string
 */
export type RentalReceiptDataDTO = {
  _id: string;
  MaPTP: string;
  DatPhong: any; // Populated Booking or ID
  Phong: any; // Populated Room or ID
  NgayNhanPhong: Date;
  NgayTraDuKien: Date;
  SoKhachThucTe: number;
  DonGiaSauDieuChinh: number;
  NhanVienCheckIn: any; // Populated Staff or ID
  TrangThai: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RentalReceiptResponseDTO:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/RentalReceiptDataDTO'
 */
export type RentalReceiptResponseDTO = {
  success: boolean;
  message: string;
  data: RentalReceiptDataDTO;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RentalReceiptListResponseDTO:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RentalReceiptDataDTO'
 */
export type RentalReceiptListResponseDTO = {
  success: boolean;
  message: string;
  data: RentalReceiptDataDTO[];
};
