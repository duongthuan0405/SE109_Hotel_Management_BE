/**
 * @swagger
 * components:
 *   schemas:
 *     BookingResponseWrapper:
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
export type BookingResponseWrapper<T> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingBaseResponse:
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
 *     BookingResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/BookingDataDTO'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookingDataDTO'
 */


export type CreateBookingDetailDTO = {
  Phong: string; // ID của phòng
};

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingDetailDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaCTDP:
 *           type: string
 *         Phong:
 *           type: object
 */
export type BookingDetailDTO = {
  _id?: string | undefined;
  MaCTDP: string;
  Phong: any; 
};

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaDatPhong:
 *           type: string
 *         KhachHang:
 *           type: object
 *         HangPhong:
 *           type: string
 *         NgayDen:
 *           type: string
 *           format: date-time
 *         NgayDi:
 *           type: string
 *           format: date-time
 *         SoKhach:
 *           type: number
 *         TienCoc:
 *           type: number
 *         ChiTietDatPhong:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookingDetailDTO'
 *         TrangThai:
 *           type: string
 */
export type BookingDataDTO = {
  _id: string;
  MaDatPhong: string;
  KhachHang: any; 
  HangPhong: string;
  NgayDen: Date;
  NgayDi: Date;
  SoKhach: number;
  TienCoc: number;
  ChiTietDatPhong: BookingDetailDTO[];
  TrangThai: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBookingDetailDTO:
 *       type: object
 *       required:
 *         - Phong
 *       properties:
 *         Phong:
 *           type: string
 *     CreateBookingRequestDTO:
 *       type: object
 *       required:
 *         - HangPhong
 *         - NgayDen
 *         - NgayDi
 *         - SoKhach
 *       properties:
 *         KhachHang:
 *           type: string
 *         HangPhong:
 *           type: string
 *         NgayDen:
 *           type: string
 *           format: date-time
 *         NgayDi:
 *           type: string
 *           format: date-time
 *         SoKhach:
 *           type: number
 *         TienCoc:
 *           type: number
 *         ChiTietDatPhong:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateBookingDetailDTO'
 */
export type CreateBookingRequestDTO = {
  KhachHang?: string | undefined; 
  HangPhong: string;
  NgayDen: string;
  NgayDi: string;
  SoKhach: number;
  TienCoc?: number | undefined;
  ChiTietDatPhong?: CreateBookingDetailDTO[] | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateBookingRequestDTO:
 *       type: object
 *       properties:
 *         HangPhong:
 *           type: string
 *         NgayDen:
 *           type: string
 *           format: date-time
 *         NgayDi:
 *           type: string
 *           format: date-time
 *         SoKhach:
 *           type: number
 *         TienCoc:
 *           type: number
 *         ChiTietDatPhong:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateBookingDetailDTO'
 *         TrangThai:
 *           type: string
 *           enum: [Pending, Confirmed, CheckedIn, CheckedOut, Cancelled, NoShow]
 */
export type UpdateBookingRequestDTO = {
  HangPhong?: string | undefined;
  NgayDen?: string | undefined;
  NgayDi?: string | undefined;
  SoKhach?: number | undefined;
  TienCoc?: number | undefined;
  ChiTietDatPhong?: CreateBookingDetailDTO[] | undefined;
  TrangThai?: string | undefined;
};
