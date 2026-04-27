import { type Request, type Response, type NextFunction } from "express";
import {
  type RoomResponseWrapper,
  type RoomDataDTO,
  type CreateRoomRequestDTO,
  type UpdateRoomRequestDTO,
} from "../dtos/RoomDTO.js";
import {
  getAllRoomsUseCase,
  getRoomByIdUseCase,
  createRoomUseCase,
  updateRoomUseCase,
  deleteRoomUseCase,
  updateRoomStatusUseCase,
} from "../useCases/index.js";
import { type RoomUCOutput } from "../useCases/types/IRoomUseCases.js";
import type { RoomStatus } from "../models/Room.js";

const mapToDTO = (room: RoomUCOutput): RoomDataDTO => ({
  _id: room.id,
  MaPhong: room.code,
  LoaiPhong: room.roomType ? {
    _id: room.roomType.id,
    MaLoaiPhong: room.roomType.code,
    TenLoaiPhong: room.roomType.name,
    DonGia: room.roomType.price,
    SoKhachToiDa: room.roomType.maxOccupancy,
  } : room.roomTypeId,
  GiaPhong: room.price,
  TrangThai: room.status,
});

const roomController = {
  getAllRooms: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllRoomsUseCase.execute();
      const response: RoomResponseWrapper<RoomDataDTO[]> = {
        success: true,
        message: "Lấy danh sách phòng thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: RoomResponseWrapper<undefined> = {
        success: false,
        message: "Lỗi khi lấy danh sách phòng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  getRoomById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getRoomByIdUseCase.execute(req.params.id as string);
      if (!result) {
        throw { status: 404, message: "Không tìm thấy phòng" };
      }
      const response: RoomResponseWrapper<RoomDataDTO> = {
        success: true,
        message: "Lấy thông tin phòng thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: RoomResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin phòng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  createRoom: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateRoomRequestDTO;
      const result = await createRoomUseCase.execute({
        code: body.MaPhong,
        roomTypeId: body.LoaiPhong,
        price: body.GiaPhong,
        status: body.TrangThai,
      });
      const response: RoomResponseWrapper<RoomDataDTO> = {
        success: true,
        message: "Tạo phòng thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: RoomResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi tạo phòng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  updateRoom: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateRoomRequestDTO;
      const result = await updateRoomUseCase.execute({
        id: req.params.id as string,
        code: body.MaPhong as string,
        roomTypeId: body.LoaiPhong as string,
        price: body.GiaPhong as number,
        status: body.TrangThai as RoomStatus,
      });
      if (!result) {
        throw { status: 404, message: "Không tìm thấy phòng" };
      }
      const response: RoomResponseWrapper<RoomDataDTO> = {
        success: true,
        message: "Cập nhật phòng thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: RoomResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật phòng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const result = await updateRoomStatusUseCase.execute({ id: req.params.id as string, status });
      if (!result) {
        throw { status: 404, message: "Không tìm thấy phòng" };
      }
      const response: RoomResponseWrapper<RoomDataDTO> = {
        success: true,
        message: "Cập nhật trạng thái phòng thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: RoomResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật trạng thái phòng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  deleteRoom: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteRoomUseCase.execute(req.params.id as string);
      const response: RoomResponseWrapper<undefined> = {
        success: true,
        message: "Xóa phòng thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: RoomResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi xóa phòng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },
};

export default roomController;
