import { type Request, type Response, type NextFunction } from "express";
import {
  type ServiceUsageHistoryResponseWrapper,
  type ServiceUsageHistoryDataDTO,
  type CreateServiceUsageHistoryRequestDTO,
  type UpdateServiceUsageHistoryRequestDTO,
} from "../dtos/ServiceUsageHistoryDTO.js";
import {
  getAllServiceUsageHistoryUseCase,
  getServiceUsageHistoryByIdUseCase,
  getHistoryByServiceUsageIdUseCase,
  createServiceUsageHistoryUseCase,
  updateServiceUsageHistoryUseCase,
  deleteServiceUsageHistoryUseCase,
} from "../useCases/index.js";
import { type ServiceUsageHistoryUCOutput } from "../useCases/types/IServiceUsageHistoryUseCases.js";

const mapToDTO = (record: ServiceUsageHistoryUCOutput): ServiceUsageHistoryDataDTO => ({
  _id: record.id,
  MaLSDV: record.code,
  SuDungDichVu: record.serviceUsage
    ? {
        _id: record.serviceUsage.id,
        MaSDDV: record.serviceUsage.code,
        SoLuong: record.serviceUsage.quantity,
        TrangThai: record.serviceUsage.status,
      }
    : record.serviceUsageId,
  TrangThaiCu: record.oldStatus,
  TrangThaiMoi: record.newStatus,
  ThoiGian: record.changedAt,
  TaiKhoan: record.user
    ? {
        _id: record.user.id,
        TenDangNhap: record.user.username,
      }
    : record.userId,
});

const serviceUsageHistoryController = {
  // GET /api/service-usage-history
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllServiceUsageHistoryUseCase.execute();
      const response: ServiceUsageHistoryResponseWrapper<ServiceUsageHistoryDataDTO[]> = {
        success: true,
        message: "Lấy danh sách lịch sử sử dụng dịch vụ thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: ServiceUsageHistoryResponseWrapper<undefined> = {
        success: false,
        message: "Lỗi khi lấy danh sách lịch sử sử dụng dịch vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // GET /api/service-usage-history/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getServiceUsageHistoryByIdUseCase.execute(req.params.id as string);
      if (!result) {
        throw { status: 404, message: "Lịch sử sử dụng dịch vụ không tồn tại" };
      }
      const response: ServiceUsageHistoryResponseWrapper<ServiceUsageHistoryDataDTO> = {
        success: true,
        message: "Lấy thông tin lịch sử sử dụng dịch vụ thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: ServiceUsageHistoryResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin lịch sử sử dụng dịch vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // GET /api/service-usage-history/usage/:serviceUsageId
  getByServiceUsageId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getHistoryByServiceUsageIdUseCase.execute(req.params.serviceUsageId as string);
      const response: ServiceUsageHistoryResponseWrapper<ServiceUsageHistoryDataDTO[]> = {
        success: true,
        message: "Lấy lịch sử sử dụng dịch vụ thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: ServiceUsageHistoryResponseWrapper<undefined> = {
        success: false,
        message: "Lỗi khi lấy lịch sử sử dụng dịch vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // POST /api/service-usage-history
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateServiceUsageHistoryRequestDTO;

      if (!body.SuDungDichVu || !body.TrangThaiCu || !body.TrangThaiMoi) {
        throw { status: 400, message: "Vui lòng cung cấp đủ thông tin lịch sử sử dụng dịch vụ" };
      }

      const result = await createServiceUsageHistoryUseCase.execute({
        serviceUsageId: body.SuDungDichVu,
        oldStatus: body.TrangThaiCu,
        newStatus: body.TrangThaiMoi,
        userId: body.TaiKhoan,
      });

      const response: ServiceUsageHistoryResponseWrapper<ServiceUsageHistoryDataDTO> = {
        success: true,
        message: "Tạo lịch sử sử dụng dịch vụ thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: ServiceUsageHistoryResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi tạo lịch sử sử dụng dịch vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // PUT /api/service-usage-history/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateServiceUsageHistoryRequestDTO;

      if (!body.TrangThaiMoi) {
        throw { status: 400, message: "Vui lòng cung cấp trạng thái mới" };
      }

      const result = await updateServiceUsageHistoryUseCase.execute({
        id: req.params.id as string,
        newStatus: body.TrangThaiMoi,
      });

      if (!result) {
        throw { status: 404, message: "Lịch sử sử dụng dịch vụ không tồn tại" };
      }

      const response: ServiceUsageHistoryResponseWrapper<ServiceUsageHistoryDataDTO> = {
        success: true,
        message: "Cập nhật lịch sử sử dụng dịch vụ thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: ServiceUsageHistoryResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật lịch sử sử dụng dịch vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // DELETE /api/service-usage-history/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteServiceUsageHistoryUseCase.execute(req.params.id as string);
      const response: ServiceUsageHistoryResponseWrapper<undefined> = {
        success: true,
        message: "Xóa lịch sử sử dụng dịch vụ thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: ServiceUsageHistoryResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi xóa lịch sử sử dụng dịch vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },
};

export default serviceUsageHistoryController;
