import type { ServiceUsageHistoryStatus } from "../models/ServiceUsageHistory.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceUsageHistoryResponseWrapper:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         error:
 *           type: string
 *
 *     ServiceUsageHistoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/ServiceUsageHistoryDataDTO'
 *
 *     ServiceUsageHistoryListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ServiceUsageHistoryDataDTO'
 */
export type ServiceUsageHistoryResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceUsageHistoryDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaLSDV:
 *           type: string
 *         SuDungDichVu:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             MaSDDV:
 *               type: string
 *             SoLuong:
 *               type: number
 *             TrangThai:
 *               type: string
 *         TrangThaiCu:
 *           type: string
 *         TrangThaiMoi:
 *           type: string
 *         ThoiGian:
 *           type: string
 *           format: date-time
 *         TaiKhoan:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             TenDangNhap:
 *               type: string
 */
export type ServiceUsageHistoryDataDTO = {
  _id: string;
  MaLSDV: string;
  SuDungDichVu: any;           // Populated or ID
  TrangThaiCu: ServiceUsageHistoryStatus | undefined;
  TrangThaiMoi: ServiceUsageHistoryStatus;
  ThoiGian: Date;
  TaiKhoan: any;               // Populated or ID
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateServiceUsageHistoryRequestDTO:
 *       type: object
 *       required:
 *         - SuDungDichVu
 *         - TrangThaiCu
 *         - TrangThaiMoi
 *       properties:
 *         SuDungDichVu:
 *           type: string
 *         TrangThaiCu:
 *           type: string
 *         TrangThaiMoi:
 *           type: string
 *         TaiKhoan:
 *           type: string
 */
export type CreateServiceUsageHistoryRequestDTO = {
  SuDungDichVu: string;
  TrangThaiCu?: ServiceUsageHistoryStatus | undefined;
  TrangThaiMoi: ServiceUsageHistoryStatus;
  TaiKhoan?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateServiceUsageHistoryRequestDTO:
 *       type: object
 *       required:
 *         - TrangThaiMoi
 *       properties:
 *         TrangThaiMoi:
 *           type: string
 */
export type UpdateServiceUsageHistoryRequestDTO = {
  TrangThaiMoi: ServiceUsageHistoryStatus;
};
