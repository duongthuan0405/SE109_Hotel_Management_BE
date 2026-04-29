import { type Request, type Response, type NextFunction } from "express";
import {
  type CreateServiceUsageRequestDTO,
  type UpdateServiceUsageRequestDTO,
  type ServiceUsageDataDTO,
} from "../dtos/ServiceUsageDTO.js";
import {
  createServiceUsageUseCase,
  getAllServiceUsagesUseCase,
  getServiceUsageByIdUseCase,
  getServiceUsagesByCustomerIdUseCase,
  customerGetMyServiceUsagesUseCase,
  customerOrderServiceUseCase,
  updateServiceUsageUseCase,
  deleteServiceUsageUseCase,
} from "../useCases/index.js";
import { type ServiceUsage } from "../models/ServiceUsage.js";

const mapToDTO = (usage: ServiceUsage): ServiceUsageDataDTO => ({
  _id: usage.id,
  MaSDDV: usage.code,
  PhieuThuePhong: usage.rentalSlip ? {
    _id: usage.rentalSlip.id,
    MaPTP: usage.rentalSlip.code,
    DatPhong: usage.rentalSlip.bookingId,
    Phong: usage.rentalSlip.roomId,
    NgayNhanPhong: usage.rentalSlip.checkInDate,
    NgayTraDuKien: usage.rentalSlip.expectedCheckOutDate,
    TrangThai: usage.rentalSlip.status,
  } : usage.rentalSlipId,
  DichVu: usage.service ? {
    _id: usage.service.id,
    MaDV: usage.service.code,
    TenDV: usage.service.name,
    DonGia: usage.service.price,
  } : usage.serviceId,
  SoLuong: usage.quantity,
  DonGia: usage.unitPrice,
  ThanhTien: usage.totalAmount,
  ThoiDiemYeuCau: usage.requestedAt,
  TrangThai: usage.status,
  createdAt: usage.createdAt,
  updatedAt: usage.updatedAt,
});

const serviceUsageController = {
  getAllServiceUsages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllServiceUsagesUseCase.execute({});
      res.status(200).json({
        success: true,
        message: "Lấy danh sách sử dụng dịch vụ thành công",
        data: result.map(mapToDTO),
      });
    } catch (error) {
      next(error);
    }
  },

  getServiceUsageById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getServiceUsageByIdUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Lấy thông tin sử dụng dịch vụ thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  getServiceUsagesByCustomerId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getServiceUsagesByCustomerIdUseCase.execute({
        customerId: req.params.customerId as string,
      });
      res.status(200).json({
        success: true,
        message: "Lấy lịch sử dịch vụ của khách hàng thành công",
        data: result.map(mapToDTO),
      });
    } catch (error) {
      next(error);
    }
  },

  getMyServiceUsages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await customerGetMyServiceUsagesUseCase.execute({ userId });
      res.status(200).json({
        success: true,
        message: "Lấy lịch sử dịch vụ của bạn thành công",
        data: result.map(mapToDTO),
      });
    } catch (error) {
      next(error);
    }
  },

  customerOrderService: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const userId = (req as any).user.id;

      const result = await customerOrderServiceUseCase.execute({
        userId,
        rentalSlipId: body.PhieuThuePhong,
        serviceId: body.DichVu,
        quantity: body.SoLuong,
      });

      res.status(201).json({
        success: true,
        message: "Đặt dịch vụ thành công!",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  createServiceUsage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateServiceUsageRequestDTO;

      if (!body.PhieuThuePhong || !body.DichVu || !body.SoLuong || !body.DonGia || !body.ThanhTien) {
        res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp đủ thông tin sử dụng dịch vụ",
        });
        return;
      }

      const result = await createServiceUsageUseCase.execute({
        rentalSlipId: body.PhieuThuePhong,
        serviceId: body.DichVu,
        quantity: body.SoLuong,
        unitPrice: body.DonGia,
        totalAmount: body.ThanhTien,
        requestedAt: body.NgaySDV ? new Date(body.NgaySDV) : undefined,
        executorUserId: (req as any).user.id,
      });

      res.status(201).json({
        success: true,
        message: "Tạo sử dụng dịch vụ thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  updateServiceUsage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateServiceUsageRequestDTO;
      const result = await updateServiceUsageUseCase.execute({
        id: req.params.id as string,
        quantity: body.SoLuong,
        status: body.TrangThai as any,
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật sử dụng dịch vụ thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  deleteServiceUsage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deleteServiceUsageUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Xóa sử dụng dịch vụ thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default serviceUsageController;
