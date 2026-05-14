import { type Request, type Response, type NextFunction } from "express";
import { type CreateBookingRequestDTO, type UpdateBookingRequestDTO, type BookingDataDTO } from "../dtos/BookingDTO.js";
import {
  staffCreateBookingUseCase,
  staffCreateWalkInBookingUseCase,
  staffGetAllBookingsUseCase,
  staffGetBookingByIdUseCase,
  staffUpdateBookingUseCase,
  staffCancelBookingUseCase,
  staffDeleteBookingUseCase,
  customerCreateBookingUseCase,
  customerGetMyBookingsUseCase,
  customerGetBookingByIdUseCase,
  customerUpdateBookingUseCase,
  customerCancelBookingUseCase,
  customerDeleteBookingUseCase,
} from "../useCases/index.js";
import type { BookingUCOutput } from "../useCases/types/IBookingUseCases.js";
import roomTypePrismaRepository from "../repository/implementations/psql/RoomTypePrismaRepository.js";

const mapToDTO = (booking: BookingUCOutput, roomTypeMap?: Map<string, string>): BookingDataDTO => ({
  _id: booking.id,
  MaDatPhong: booking.code,
  KhachHang: booking.customer ? {
    _id: booking.customer.id,
    MaKH: booking.customer.code,
    HoTen: booking.customer.fullName,
    CMND: booking.customer.identityCard,
    SDT: booking.customer.phone,
    Email: booking.customer.email,
    DiaChi: booking.customer.address,
  } : booking.customerId,
  HangPhong: booking.roomClass,
  HangPhongDisplayName: roomTypeMap?.get(booking.roomClass) || {
    Normal: "Hạng Thường (Normal)",
    Standard: "Hạng Tiêu chuẩn (Standard)",
    Premium: "Hạng Cao cấp (Premium)",
    Luxury: "Hạng Sang (Luxury)",
  }[booking.roomClass] || booking.roomClass,
  NgayDen: booking.startDate,
  NgayDi: booking.endDate,
  SoLuongPhong: booking.roomQuantity,
  TienCoc: booking.deposit,
  ChiTietDatPhong: booking.details.map(d => ({
    MaCTDP: d.code,
    Phong: d.room ? {
      _id: d.room.id,
      MaPhong: d.room.code,
      GiaPhong: d.room.price,
      TrangThai: d.room.status,
    } : d.roomId
  })),
  PhieuThuePhong: (booking.rentalSlips && booking.rentalSlips.length > 0) ? {
    _id: booking.rentalSlips[0]!.id,
    MaPTP: booking.rentalSlips[0]!.code,
    MaPhong: booking.rentalSlips[0]!.room?.code || booking.rentalSlips[0]!.roomId || "N/A",
  } : undefined,
  PhieuThuePhongs: booking.rentalSlips ? booking.rentalSlips.map(rs => ({
    _id: rs.id,
    MaPTP: rs.code,
    MaPhong: rs.room?.code || rs.roomId || "N/A",
  })) : [],
  TrangThai: booking.status,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

const getRoomTypeMap = async () => {
  const roomTypes = await roomTypePrismaRepository.findAll();
  return new Map(roomTypes.map(rt => [rt.id, rt.name]));
};

const bookingController = {
  customerCreate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateBookingRequestDTO;
      const userId = (req as any).user?.id;
      const result = await customerCreateBookingUseCase.execute({
        userId: userId,
        roomClass: body.HangPhong,
        startDate: new Date(body.NgayDen),
        endDate: new Date(body.NgayDi),
        roomQuantity: body.SoLuongPhong,
        deposit: body.TienCoc,
        details: body.ChiTietDatPhong?.map(d => ({ roomId: d.Phong }))
      });
      const rtMap = await getRoomTypeMap();
      res.status(201).json({ success: true, message: "Tạo đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  customerGetAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await customerGetMyBookingsUseCase.execute({ userId });
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Lấy danh sách đặt phòng thành công", data: result.map(b => mapToDTO(b, rtMap)) });
    } catch (error) { next(error); }
  },
  customerGetById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await customerGetBookingByIdUseCase.execute({ 
        id: req.params.id as string,
        userId
      });
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Lấy thông tin đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  customerUpdate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateBookingRequestDTO;
      const userId = (req as any).user.id;
      const result = await customerUpdateBookingUseCase.execute({
        id: req.params.id as string,
        userId,
        roomClass: body.HangPhong,
        startDate: body.NgayDen ? new Date(body.NgayDen) : undefined,
        endDate: body.NgayDi ? new Date(body.NgayDi) : undefined,
        roomQuantity: body.SoLuongPhong,
        deposit: body.TienCoc,
        status: body.TrangThai,
        details: body.ChiTietDatPhong?.map(d => ({ roomId: d.Phong })),
        executorUserId: userId
      });
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Cập nhật đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  customerCancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await customerCancelBookingUseCase.execute({ 
        id: req.params.id as string,
        userId,
        executorUserId: userId
      });
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Hủy đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  customerDelete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await customerDeleteBookingUseCase.execute({ 
        id: req.params.id as string,
        userId
      });
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Xóa đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },

  staffCreate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateBookingRequestDTO;
      const result = await staffCreateBookingUseCase.execute({
        customerId: body.KhachHang,
        roomClass: body.HangPhong,
        startDate: new Date(body.NgayDen),
        endDate: new Date(body.NgayDi),
        roomQuantity: body.SoLuongPhong,
        deposit: body.TienCoc,
        details: body.ChiTietDatPhong?.map(d => ({ roomId: d.Phong })),
        executorUserId: (req as any).user.id
      });
      const rtMap = await getRoomTypeMap();
      res.status(201).json({ success: true, message: "Tạo đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  staffCreateWalkIn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await staffCreateWalkInBookingUseCase.execute({
        customerId: body.KhachHang,
        fullName: body.HoTen,
        identityCard: body.CMND,
        phone: body.SDT,
        email: body.Email,
        roomClass: body.HangPhong,
        startDate: new Date(body.NgayDen),
        endDate: new Date(body.NgayDi),
        roomQuantity: body.SoLuongPhong,
        deposit: body.TienCoc,
        details: body.ChiTietDatPhong?.map((d: any) => ({ roomId: d.Phong })),
        executorUserId: (req as any).user.id
      });
      const rtMap = await getRoomTypeMap();
      res.status(201).json({ success: true, message: "Tạo đặt phòng walk-in thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  staffGetAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await staffGetAllBookingsUseCase.execute();
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Lấy danh sách đặt phòng thành công", data: result.map(b => mapToDTO(b, rtMap)) });
    } catch (error) { next(error); }
  },
  staffGetById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await staffGetBookingByIdUseCase.execute({ id: req.params.id as string});
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Lấy thông tin đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  staffUpdate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateBookingRequestDTO;
      const result = await staffUpdateBookingUseCase.execute({
        id: req.params.id as string,
        roomClass: body.HangPhong,
        startDate: body.NgayDen ? new Date(body.NgayDen) : undefined,
        endDate: body.NgayDi ? new Date(body.NgayDi) : undefined,
        roomQuantity: body.SoLuongPhong,
        deposit: body.TienCoc,
        status: body.TrangThai,
        details: body.ChiTietDatPhong?.map(d => ({ roomId: d.Phong })),
        executorUserId: (req as any).user.id
      });
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Cập nhật đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  staffCancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await staffCancelBookingUseCase.execute({ 
        id: req.params.id as string,
        executorUserId: (req as any).user.id
      });
      const rtMap = await getRoomTypeMap();
      res.status(200).json({ success: true, message: "Hủy đặt phòng thành công", data: mapToDTO(result, rtMap) });
    } catch (error) { next(error); }
  },
  staffDelete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await staffDeleteBookingUseCase.execute({ id: req.params.id as string });
      res.status(200).json({ success: true, message: "Xóa đặt phòng thành công" });
    } catch (error) { next(error); }
  },
};

export default bookingController;

