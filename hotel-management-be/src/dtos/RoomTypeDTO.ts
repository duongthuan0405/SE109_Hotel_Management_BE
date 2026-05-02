import { type RoomType } from "../models/RoomType.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomTypeResponseWrapper:
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
export type RoomTypeResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomTypeDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaLoaiPhong:
 *           type: string
 *         TenLoaiPhong:
 *           type: string
 *         DonGia:
 *           type: number
 *         SoKhachToiDa:
 *           type: number
 */
export type RoomTypeDataDTO = {
  _id: string;
  MaLoaiPhong: string;
  TenLoaiPhong: string;
  DonGia: number;
  SoKhachToiDa: number;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRoomTypeRequestDTO:
 *       type: object
 *       required:
 *         - TenLoaiPhong
 *         - DonGia
 *         - SoKhachToiDa
 *       properties:
 *         TenLoaiPhong:
 *           type: string
 *         DonGia:
 *           type: number
 *         SoKhachToiDa:
 *           type: number
 */
export type CreateRoomTypeRequestDTO = {
  TenLoaiPhong: string;
  DonGia: number;
  SoKhachToiDa: number;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRoomTypeRequestDTO:
 *       type: object
 *       properties:
 *         TenLoaiPhong:
 *           type: string
 *         DonGia:
 *           type: number
 *         SoKhachToiDa:
 *           type: number
 */
export type UpdateRoomTypeRequestDTO = {
  TenLoaiPhong?: string | undefined;
  DonGia?: number | undefined;
  SoKhachToiDa?: number | undefined;
};
