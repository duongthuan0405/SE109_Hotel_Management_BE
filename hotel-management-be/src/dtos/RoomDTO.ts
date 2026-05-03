import type { RoomStatus } from "../models/Room.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomResponseWrapper:
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
export type RoomResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomBaseResponse:
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
 *     RoomResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/RoomDataDTO'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoomDataDTO'
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     RoomDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaPhong:
 *           type: string
 *         LoaiPhong:
 *           type: object
 *         GiaPhong:
 *           type: number
 *         TrangThai:
 *           type: string
 *           enum: [Available, Occupied, Maintenance, Reserved, Cleaning]
 */
export type RoomDataDTO = {
  _id: string;
  MaPhong: string;
  LoaiPhong: any; // Populated RoomType or ID
  GiaPhong: number;
  TrangThai: RoomStatus;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRoomRequestDTO:
 *       type: object
 *       required:
 *         - LoaiPhong
 *         - GiaPhong
 *         - TrangThai
 *       properties:
 *         LoaiPhong:
 *           type: string
 *         GiaPhong:
 *           type: number
 *         TrangThai:
 *           type: string
 *           enum: [Available, Occupied, Maintenance, Reserved, Cleaning]
 */
export type CreateRoomRequestDTO = {
  LoaiPhong: string;
  GiaPhong: number;
  TrangThai: RoomStatus;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRoomRequestDTO:
 *       type: object
 *       properties:
 *         LoaiPhong:
 *           type: string
 *         GiaPhong:
 *           type: number
 *         TrangThai:
 *           type: string
 *           enum: [Available, Occupied, Maintenance, Reserved, Cleaning]
 */
export type UpdateRoomRequestDTO = {
  LoaiPhong?: string;
  GiaPhong?: number;
  TrangThai?: RoomStatus;
};
