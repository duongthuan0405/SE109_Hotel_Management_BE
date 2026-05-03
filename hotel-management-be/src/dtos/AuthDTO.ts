/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequestDTO:
 *       type: object
 *       required:
 *         - TenDangNhap
 *         - MatKhau
 *       properties:
 *         TenDangNhap:
 *           type: string
 *         MatKhau:
 *           type: string
 */
export type LoginRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponseDTO:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         VaiTro:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/LoginResponseDTO'
 */
export type LoginResponseDTO = {
  token: string;
  VaiTro: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequestDTO:
 *       type: object
 *       required:
 *         - TenDangNhap
 *         - MatKhau
 *         - VaiTro
 *       properties:
 *         TenDangNhap:
 *           type: string
 *         MatKhau:
 *           type: string
 *         VaiTro:
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
 */
export type RegisterRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
  VaiTro: string;
  HoTen?: string | undefined;
  CMND?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
  DiaChi?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         TenDangNhap:
 *           type: string
 *         VaiTro:
 *           type: string
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/RegisterResponseDTO'
 */
export type RegisterResponseDTO = {
  id: string;
  TenDangNhap: string;
  VaiTro: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ForgotPasswordRequestDTO:
 *       type: object
 *       required:
 *         - Email
 *       properties:
 *         Email:
 *           type: string
 */
export type ForgotPasswordRequestDTO = {
  Email: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ForgotPasswordResponseDTO:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         otp:
 *           type: string
 *     ForgotPasswordResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/ForgotPasswordResponseDTO'
 */
export type ForgotPasswordResponseDTO = {
  message: string;
  otp?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPasswordRequestDTO:
 *       type: object
 *       required:
 *         - Email
 *         - OTP
 *         - MatKhau
 *       properties:
 *         Email:
 *           type: string
 *         OTP:
 *           type: string
 *         MatKhau:
 *           type: string
 */
export type ResetPasswordRequestDTO = {
  Email: string;
  OTP: string;
  MatKhau: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPasswordResponseDTO:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     ResetPasswordResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/ResetPasswordResponseDTO'
 */
export type ResetPasswordResponseDTO = {
  message: string;
};
