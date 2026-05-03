// Request DTOs
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBookingHistoryRequestDTO:
 *       type: object
 *       required:
 *         - DatPhong
 *         - TrangThaiCu
 *         - TrangThaiMoi
 *       properties:
 *         DatPhong:
 *           type: string
 *         TrangThaiCu:
 *           type: string
 *         TrangThaiMoi:
 *           type: string
 */
export type CreateBookingHistoryRequestDTO = {
  DatPhong: string;
  TrangThaiCu: string;
  TrangThaiMoi: string;
};

// Response DTOs
/**
 * @swagger
 * components:
 *   schemas:
 *     BookingHistoryDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaLSDP:
 *           type: string
 *         DatPhong:
 *           type: object
 *         TrangThaiCu:
 *           type: string
 *         TrangThaiMoi:
 *           type: string
 *         ThoiGian:
 *           type: string
 *           format: date-time
 *         TaiKhoan:
 *           type: object
 */
export type BookingHistoryDataDTO = {
  _id: string;
  MaLSDP: string;
  DatPhong: any; // Populated Booking or ID
  TrangThaiCu: string;
  TrangThaiMoi: string;
  ThoiGian: Date;
  TaiKhoan: any; // Populated User or ID
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingHistoryBaseResponse:
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
 *     BookingHistoryResponse:

 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/BookingHistoryDataDTO'
 */
export type BookingHistoryResponseDTO = {
  success: boolean;
  message: string;
  data: BookingHistoryDataDTO;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingHistoryListResponse:

 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookingHistoryDataDTO'
 */
export type BookingHistoryListResponseDTO = {
  success: boolean;
  message: string;
  data: BookingHistoryDataDTO[];
};
