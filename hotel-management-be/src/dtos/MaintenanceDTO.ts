import type { MaintenanceStatus } from "../models/Maintenance.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceResponseWrapper:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         error:
 *           type: string
 *
 *     MaintenanceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/MaintenanceDataDTO'
 *
 *     MaintenanceListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MaintenanceDataDTO'
 */
export type MaintenanceResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaPBT:
 *           type: string
 *         Phong:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             MaPhong:
 *               type: string
 *             GiaPhong:
 *               type: number
 *             TrangThai:
 *               type: string
 *         KhachHang:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             MaKH:
 *               type: string
 *             HoTen:
 *               type: string
 *         NVKyThuat:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             HoTen:
 *               type: string
 *         NoiDung:
 *           type: string
 *         NgayThucHien:
 *           type: string
 *           format: date-time
 *         NgayKetThuc:
 *           type: string
 *           format: date-time
 *         TrangThai:
 *           type: string
 *           enum: [Pending, In_Progress, Completed, Cancelled]
 */
export type MaintenanceDataDTO = {
  _id: string;
  MaPBT: string;
  Phong: any;          // Populated Room object or ID
  KhachHang?: any;     // Populated Customer object or ID
  NVKyThuat?: any;     // Populated Staff object or ID (HoTen only)
  NoiDung: string;
  NgayThucHien: Date;
  NgayKetThuc: Date;
  TrangThai: MaintenanceStatus;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMaintenanceRequestDTO:
 *       type: object
 *       required:
 *         - Phong
 *         - NVKyThuat
 *         - NgayThucHien
 *         - NgayKetThuc
 *         - NoiDung
 *       properties:
 *         Phong:
 *           type: string
 *         NVKyThuat:
 *           type: string
 *         NgayThucHien:
 *           type: string
 *           format: date-time
 *         NgayKetThuc:
 *           type: string
 *           format: date-time
 *         NoiDung:
 *           type: string
 */

export type CreateMaintenanceRequestDTO = {
  Phong: string;
  NVKyThuat: string;
  NgayThucHien: Date;
  NgayKetThuc: Date;
  NoiDung: string;
};


/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateMaintenanceRequestDTO:
 *       type: object
 *       properties:
 *         NoiDung:
 *           type: string
 *         NVKyThuat:
 *           type: string
 *         NgayThucHien:
 *           type: string
 *           format: date-time
 *         NgayKetThuc:
 *           type: string
 *           format: date-time

 *         TrangThai:
 *           type: string
 *           enum: [Pending, In_Progress, Completed, Cancelled]
 */
export type UpdateMaintenanceRequestDTO = {
  NoiDung?: string;
  NVKyThuat?: string;
  NgayThucHien?: Date;
  NgayKetThuc?: Date;
  TrangThai?: MaintenanceStatus;
};


/**
 * @swagger
 * components:
 *   schemas:
 *     GuestCreateMaintenanceRequestDTO:
 *       type: object
 *       required:
 *         - Phong
 *         - NoiDung
 *       properties:
 *         Phong:
 *           type: string
 *         NoiDung:
 *           type: string
 */
export type GuestCreateMaintenanceRequestDTO = {
  Phong: string;
  NoiDung: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     NextCodeResponseDTO:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         nextCode:
 *           type: string
 */
export type NextCodeResponseDTO = {
  success: boolean;
  nextCode: string;
};
