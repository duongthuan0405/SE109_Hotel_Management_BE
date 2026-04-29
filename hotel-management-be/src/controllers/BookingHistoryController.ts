import { type Request, type Response, type NextFunction } from "express";
import {
  type CreateBookingHistoryRequestDTO,
  type BookingHistoryDataDTO,
} from "../dtos/BookingHistoryDTO.js";
import {
  createBookingHistoryUseCase,
  getAllBookingHistoryUseCase,
  getMyBookingHistoryUseCase,
  getBookingHistoryByIdUseCase,
  getHistoryByBookingIdUseCase,
  deleteBookingHistoryUseCase,
} from "../useCases/index.js";
import { type BookingHistory } from "../models/BookingHistory.js";

const mapToDTO = (history: BookingHistory): BookingHistoryDataDTO => ({
  _id: history.id,
  MaLSDP: history.code,
  DatPhong: history.booking
    ? {
        _id: history.booking.id,
        MaDatPhong: history.booking.code,
        HangPhong: history.booking.roomClass,
        NgayDen: history.booking.startDate,
        NgayDi: history.booking.endDate,
        SoKhach: history.booking.guestCount,
        TienCoc: history.booking.deposit,
        TrangThai: history.booking.status,
      }
    : history.bookingId,
  TrangThaiCu: history.oldStatus,
  TrangThaiMoi: history.newStatus,
  ThoiGian: history.changedAt,
  TaiKhoan: history.user
    ? {
        _id: history.user.id,
        TenDangNhap: history.user.username,
      }
    : history.userId,
  createdAt: history.createdAt,
  updatedAt: history.updatedAt,
});

const bookingHistoryController = {
  createBookingHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateBookingHistoryRequestDTO;

      if (!body.DatPhong || !body.TrangThaiCu || !body.TrangThaiMoi) {
        throw { status: 400, message: "Vui lòng cung cấp đủ thông tin lịch sử đặt phòng" };
      }

      const userId = (req as any).user.id;
      const result = await createBookingHistoryUseCase.execute({
        bookingId: body.DatPhong,
        oldStatus: body.TrangThaiCu as any,
        newStatus: body.TrangThaiMoi as any,
        userId: userId,
      });

      res.status(201).json({
        success: true,
        message: "Tạo lịch sử đặt phòng thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  getAllBookingHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllBookingHistoryUseCase.execute({});
      res.status(200).json({
        success: true,
        message: "Lấy danh sách lịch sử đặt phòng thành công",
        data: result.map(mapToDTO),
      });
    } catch (error) {
      next(error);
    }
  },

  getBookingHistoryById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getBookingHistoryByIdUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Lấy thông tin lịch sử đặt phòng thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  getMyHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await getMyBookingHistoryUseCase.execute({ userId });
      res.status(200).json({
        success: true,
        message: "Lấy lịch sử đặt phòng của bạn thành công",
        data: result.map(mapToDTO),
      });
    } catch (error) {
      next(error);
    }
  },

  getHistoryByBookingId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getHistoryByBookingIdUseCase.execute({ bookingId: req.params.bookingId as string });
      res.status(200).json({
        success: true,
        message: "Lấy lịch sử đặt phòng thành công",
        data: result.map(mapToDTO),
      });
    } catch (error) {
      next(error);
    }
  },

  deleteBookingHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deleteBookingHistoryUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Xóa lịch sử đặt phòng thành công",
        data: result, // Trả về dạng object thô như cũ hoặc mapToDTO tùy ý, map cho đồng bộ
      });
    } catch (error) {
      next(error);
    }
  },
};

export default bookingHistoryController;
