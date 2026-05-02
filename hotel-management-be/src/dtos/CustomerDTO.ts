/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerResponseWrapper:
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
export type CustomerResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaKH:
 *           type: string
 *         HoTen:
 *           type: string
 *         CMND:
 *           type: string
 *         SDT:
 *           type: string
 *         Email:
 *           type: string
 *         DiaChi:
 *           type: string
 *         TaiKhoan:
 *           type: object
 */
export type CustomerDataDTO = {
  _id: string;
  MaKH: string;
  HoTen: string;
  CMND: string;
  SDT: string;
  Email: string;
  DiaChi?: string | undefined;
  TaiKhoan?: any | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCustomerRequestDTO:
 *       type: object
 *       required:
 *         - HoTen
 *         - CMND
 *         - SDT
 *         - Email
 *       properties:
 *         HoTen:
 *           type: string
 *         CMND:
 *           type: string
 *         SDT:
 *           type: string
 *         Email:
 *           type: string
 *         DiaChi:
 *           type: string
 *         TaiKhoanId:
 *           type: string
 */
export type CreateCustomerRequestDTO = {
  HoTen: string;
  CMND: string;
  SDT: string;
  Email: string;
  DiaChi?: string | undefined;
  TaiKhoanId?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCustomerRequestDTO:
 *       type: object
 *       properties:
 *         HoTen:
 *           type: string
 *         CMND:
 *           type: string
 *         SDT:
 *           type: string
 *         Email:
 *           type: string
 *         DiaChi:
 *           type: string
 */
export type UpdateCustomerRequestDTO = {
  HoTen?: string | undefined;
  CMND?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
  DiaChi?: string | undefined;
};
