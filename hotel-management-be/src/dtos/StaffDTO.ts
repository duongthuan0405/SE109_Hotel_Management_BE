/**
 * @swagger
 * components:
 *   schemas:
 *     StaffResponseWrapper:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         error:
 *           type: string
 */
export type StaffResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     StaffBaseResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         error:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StaffResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/StaffDataDTO'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StaffListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StaffDataDTO'
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     StaffDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         TaiKhoan:
 *           type: object
 *         MaNV:
 *           type: string
 *         HoTen:
 *           type: string
 *         ChucVu:
 *           type: string
 *         SDT:
 *           type: string
 *         Email:
 *           type: string
 */
export type StaffDataDTO = {
  _id: string;
  TaiKhoan: any; // Populated object
  MaNV: string;
  HoTen: string;
  ChucVu: string;
  SDT: string;
  Email: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStaffRequestDTO:
 *       type: object
 *       required:
 *         - TaiKhoanId
 *         - HoTen
 *         - ChucVu
 *         - SDT
 *         - Email
 *       properties:
 *         TaiKhoanId:
 *           type: string
 *         HoTen:
 *           type: string
 *         ChucVu:
 *           type: string
 *         SDT:
 *           type: string
 *         Email:
 *           type: string
 */
export type CreateStaffRequestDTO = {
  TaiKhoanId: string;
  HoTen: string;
  ChucVu: string;
  SDT: string;
  Email: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateStaffRequestDTO:
 *       type: object
 *       properties:
 *         HoTen:
 *           type: string
 *         ChucVu:
 *           type: string
 *         SDT:
 *           type: string
 *         Email:
 *           type: string
 */
export type UpdateStaffRequestDTO = {
  HoTen?: string | undefined;
  ChucVu?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
};
