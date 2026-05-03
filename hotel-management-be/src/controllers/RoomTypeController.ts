import { type Request, type Response, type NextFunction } from "express";
import {
  type RoomTypeResponseWrapper,
  type RoomTypeDataDTO,
  type CreateRoomTypeRequestDTO,
  type UpdateRoomTypeRequestDTO,
} from "../dtos/RoomTypeDTO.js";
import {
  getAllRoomTypesUseCase,
  getRoomTypeByIdUseCase,
  createRoomTypeUseCase,
  updateRoomTypeUseCase,
  deleteRoomTypeUseCase,
} from "../useCases/index.js";
import { type RoomTypeUCOutput } from "../useCases/types/IRoomTypeUseCases.js";

const mapToDTO = (roomType: RoomTypeUCOutput): RoomTypeDataDTO => ({
  _id: roomType.id,
  MaLoaiPhong: roomType.code,
  TenLoaiPhong: roomType.name,
  DonGia: roomType.price,
  SoKhachToiDa: roomType.maxOccupancy,
});

const roomTypeController = {
  getAllRoomTypes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllRoomTypesUseCase.execute();
      const response: RoomTypeResponseWrapper<RoomTypeDataDTO[]> = {
        success: true,
        message: "Lấy danh sách loại phòng thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }

  },

  getRoomTypeById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getRoomTypeByIdUseCase.execute({ id: req.params.id as string });
      const response: RoomTypeResponseWrapper<RoomTypeDataDTO> = {
        success: true,
        message: "Lấy thông tin loại phòng thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }

  },

  createRoomType: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateRoomTypeRequestDTO;
      const result = await createRoomTypeUseCase.execute({
        name: body.TenLoaiPhong,
        price: body.DonGia,
        maxOccupancy: body.SoKhachToiDa,
      });
      const response: RoomTypeResponseWrapper<RoomTypeDataDTO> = {
        success: true,
        message: "Tạo loại phòng thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }

  },

  updateRoomType: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateRoomTypeRequestDTO;
      const result = await updateRoomTypeUseCase.execute({
        id: req.params.id as string,
        name: body.TenLoaiPhong as string,
        price: body.DonGia,
        maxOccupancy: body.SoKhachToiDa,
      });
      const response: RoomTypeResponseWrapper<RoomTypeDataDTO> = {
        success: true,
        message: "Cập nhật loại phòng thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }

  },

  deleteRoomType: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deleteRoomTypeUseCase.execute({ id: req.params.id as string });
      const response: RoomTypeResponseWrapper<RoomTypeDataDTO> = {
        success: true,
        message: "Xóa loại phòng thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }

  },
};

export default roomTypeController;
