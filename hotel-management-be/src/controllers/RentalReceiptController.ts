import { type Request, type Response, type NextFunction } from "express";
import {
  type CreateRentalReceiptRequestDTO,
  type UpdateRentalReceiptRequestDTO,
} from "../dtos/RentalReceiptDTO.js";
import {
  createRentalReceiptUseCase,
  getAllRentalReceiptsUseCase,
  getRentalReceiptByIdUseCase,
  updateRentalReceiptUseCase,
  checkOutUseCase,
  deleteRentalReceiptUseCase,
} from "../useCases/index.js";

const rentalReceiptController = {
  getAllRentalReceipts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllRentalReceiptsUseCase.execute({});
      res.status(200).json({
        success: true,
        message: "Lấy danh sách phiếu thuê phòng thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getRentalReceiptById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getRentalReceiptByIdUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Lấy thông tin phiếu thuê phòng thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  createRentalReceipt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateRentalReceiptRequestDTO;
      const result = await createRentalReceiptUseCase.execute({
        slipCode: body.MaPTP,
        bookingId: body.DatPhong,
        roomId: body.Phong,
        expectedCheckOutDate: new Date(body.NgayTraDuKien),
        actualGuestCount: body.SoKhachThucTe,
        adjustedPrice: body.DonGiaSauDieuChinh,
        checkInStaffId: body.NhanVienCheckIn,
      });

      res.status(201).json({
        success: true,
        message: "Tạo phiếu thuê phòng thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  updateRentalReceipt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateRentalReceiptRequestDTO;
      const result = await updateRentalReceiptUseCase.execute({
        id: req.params.id as string,
        expectedCheckOutDate: body.NgayTraDuKien ? new Date(body.NgayTraDuKien) : undefined,
        actualGuestCount: body.SoKhachThucTe,
        adjustedPrice: body.DonGiaSauDieuChinh,
        status: body.TrangThai as any,
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật phiếu thuê phòng thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  checkOut: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await checkOutUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Check out thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteRentalReceipt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deleteRentalReceiptUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Xóa phiếu thuê phòng thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default rentalReceiptController;
