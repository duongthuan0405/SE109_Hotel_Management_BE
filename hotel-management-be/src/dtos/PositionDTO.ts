/**
 * @swagger
 * components:
 *   schemas:
 *     PositionResponseWrapper:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         error:
 *           type: string
 *
 *     PositionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/PositionDataDTO'
 *
 *     PositionListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PositionDataDTO'
 */
export type PositionResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     PositionDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaChucVu:
 *           type: string
 *         TenChucVu:
 *           type: string
 */
export type PositionDataDTO = {
  _id: string;
  MaChucVu: string;
  TenChucVu: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePositionRequestDTO:
 *       type: object
 *       required:
 *         - TenChucVu
 *       properties:
 *         TenChucVu:
 *           type: string
 */
export type CreatePositionRequestDTO = {
  TenChucVu: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePositionRequestDTO:
 *       type: object
 *       required:
 *         - TenChucVu
 *       properties:
 *         TenChucVu:
 *           type: string
 */
export type UpdatePositionRequestDTO = {
  TenChucVu: string;
};
