/**
 * @swagger
 * components:
 *   schemas:
 *     CreateServiceRequestDTO:
 *       type: object
 *       required:
 *         - TenDV
 *         - DonGia
 *       properties:
 *         TenDV:
 *           type: string
 *         DonGia:
 *           type: number
 */
export type CreateServiceRequestDTO = {
  TenDV: string;
  DonGia: number;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateServiceRequestDTO:
 *       type: object
 *       properties:
 *         TenDV:
 *           type: string
 *         DonGia:
 *           type: number
 */
export type UpdateServiceRequestDTO = {
  TenDV?: string | undefined;
  DonGia?: number | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceResponseWrapper:
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
export type ServiceResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceResponseDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaDV:
 *           type: string
 *         TenDV:
 *           type: string
 *         DonGia:
 *           type: number
 */
export type ServiceResponseDTO = {
  _id: string;
  MaDV: string;
  TenDV: string;
  DonGia: number;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
