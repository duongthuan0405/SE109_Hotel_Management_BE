import { type User } from "../models/User.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     AccountResponseWrapper:
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
export type AccountResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     AccountDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         TenDangNhap:
 *           type: string
 *         VaiTro:
 *           type: string
 */
export type AccountDataDTO = {
  _id: string;
  TenDangNhap: string;
  VaiTro: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAccountRequestDTO:
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
 *           enum: [Admin, Manager, Receptionist, Customer]
 */
export type CreateAccountRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
  VaiTro: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateAccountRequestDTO:
 *       type: object
 *       properties:
 *         VaiTro:
 *           type: string
 *           enum: [Admin, Manager, Receptionist, Customer]
 */
export type UpdateAccountRequestDTO = {
  VaiTro?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ChangePasswordRequestDTO:
 *       type: object
 *       required:
 *         - MatKhauCu
 *         - MatKhauMoi
 *       properties:
 *         MatKhauCu:
 *           type: string
 *         MatKhauMoi:
 *           type: string
 */
export type ChangePasswordRequestDTO = {
  MatKhauCu: string;
  MatKhauMoi: string;
};
