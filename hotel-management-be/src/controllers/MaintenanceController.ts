import { type Request, type Response, type NextFunction } from "express";
import {
  type MaintenanceResponseWrapper,
  type MaintenanceDataDTO,
  type CreateMaintenanceRequestDTO,
  type UpdateMaintenanceRequestDTO,
  type GuestCreateMaintenanceRequestDTO,
  type NextCodeResponseDTO,
} from "../dtos/MaintenanceDTO.js";
import {
  getAllMaintenanceUseCase,
  getMaintenanceByIdUseCase,
  getNextMaintenanceCodeUseCase,
  createMaintenanceUseCase,
  updateMaintenanceUseCase,
  deleteMaintenanceUseCase,
  guestGetMaintenanceRequestsUseCase,
  guestCreateMaintenanceRequestUseCase,
} from "../useCases/index.js";
import { type MaintenanceUCOutput } from "../useCases/types/IMaintenanceUseCases.js";

const mapToDTO = (record: MaintenanceUCOutput): MaintenanceDataDTO => ({
  _id: record.id,
  MaPBT: record.code,
  Phong: record.room
    ? {
        _id: record.room.id,
        MaPhong: record.room.code,
        GiaPhong: record.room.price,
        TrangThai: record.room.status,
      }
    : record.roomId,
  KhachHang: record.customer
    ? {
        _id: record.customer.id,
        MaKH: record.customer.code,
        HoTen: record.customer.fullName,
      }
    : record.customerId,
  NVKyThuat: record.technician
    ? {
        _id: record.technician.id,
        HoTen: record.technician.fullName,
      }
    : record.technicianId,
  NoiDung: record.content,
  NgayThucHien: record.startDate,
  NgayKetThuc: record.endDate,
  TrangThai: record.status,
});

const maintenanceController = {
  // GET /api/maintenance
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllMaintenanceUseCase.execute();
      const response: MaintenanceResponseWrapper<MaintenanceDataDTO[]> = {
        success: true,
        message: "Lấy danh sách phiếu bảo trì thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: MaintenanceResponseWrapper<undefined> = {
        success: false,
        message: "Lỗi khi lấy danh sách phiếu bảo trì",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // GET /api/maintenance/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getMaintenanceByIdUseCase.execute(req.params.id as string);
      if (!result) {
        throw { status: 404, message: "Phiếu bảo trì không tồn tại" };
      }
      const response: MaintenanceResponseWrapper<MaintenanceDataDTO> = {
        success: true,
        message: "Lấy thông tin phiếu bảo trì thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: MaintenanceResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin phiếu bảo trì",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // GET /api/maintenance/next-code
  getNextCode: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nextCode = await getNextMaintenanceCodeUseCase.execute();
      const response: NextCodeResponseDTO = {
        success: true,
        nextCode,
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: MaintenanceResponseWrapper<undefined> = {
        success: false,
        message: "Lỗi khi lấy mã phiếu bảo trì tiếp theo",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // POST /api/maintenance
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateMaintenanceRequestDTO;

      // Validate input
      if (!body.Phong || !body.NVKyThuat || !body.NgayThucHien || !body.NgayKetThuc || !body.NoiDung) {
        throw { status: 400, message: "Vui lòng cung cấp đủ thông tin phiếu bảo trì" };
      }

      const result = await createMaintenanceUseCase.execute({
        roomId: body.Phong,
        technicianId: body.NVKyThuat,
        content: body.NoiDung,
        startDate: body.NgayThucHien,
        endDate: body.NgayKetThuc,
      });

      const response: MaintenanceResponseWrapper<MaintenanceDataDTO> = {
        success: true,
        message: "Tạo phiếu bảo trì thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: MaintenanceResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi tạo phiếu bảo trì",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // PUT /api/maintenance/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateMaintenanceRequestDTO;

      const result = await updateMaintenanceUseCase.execute({
        id: req.params.id as string,
        content: body.NoiDung,
        technicianId: body.NVKyThuat,
        startDate: body.NgayThucHien,
        endDate: body.NgayKetThuc,
        status: body.TrangThai,
      });

      if (!result) {
        throw { status: 404, message: "Phiếu bảo trì không tồn tại" };
      }

      const response: MaintenanceResponseWrapper<MaintenanceDataDTO> = {
        success: true,
        message: "Cập nhật phiếu bảo trì thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: MaintenanceResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật phiếu bảo trì",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // DELETE /api/maintenance/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteMaintenanceUseCase.execute(req.params.id as string);
      const response: MaintenanceResponseWrapper<undefined> = {
        success: true,
        message: "Xóa phiếu bảo trì thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: MaintenanceResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi xóa phiếu bảo trì",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // GET /api/maintenance/guest/requests
  guestGetRequests: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await guestGetMaintenanceRequestsUseCase.execute(userId);
      const response: MaintenanceResponseWrapper<MaintenanceDataDTO[]> = {
        success: true,
        data: result.map(mapToDTO),
        message: "Lấy danh sách yêu cầu bảo trì thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: MaintenanceResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy yêu cầu bảo trì",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // POST /api/maintenance/guest/request
  guestCreateRequest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as GuestCreateMaintenanceRequestDTO;
      const userId = (req as any).user.id;

      if (!body.Phong || !body.NoiDung) {
        throw { status: 400, message: "Vui lòng cung cấp phòng và nội dung yêu cầu" };
      }

      const result = await guestCreateMaintenanceRequestUseCase.execute({
        userId,
        roomId: body.Phong,
        content: body.NoiDung,
      });

      const response: MaintenanceResponseWrapper<MaintenanceDataDTO> = {
        success: true,
        message: "Gửi yêu cầu bảo trì thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: MaintenanceResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi gửi yêu cầu bảo trì",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },
};

export default maintenanceController;
