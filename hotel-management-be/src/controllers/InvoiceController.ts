import { type Request, type Response, type NextFunction } from "express";
import { type CreateInvoiceRequestDTO, type CreateCheckoutInvoiceRequestDTO, type InvoiceDataDTO } from "../dtos/InvoiceDTO.js";
import {
  createInvoiceUseCase,
  createCheckoutInvoiceUseCase,
  getPreviewInvoiceUseCase,
  getAllInvoicesUseCase,
  getInvoiceByIdUseCase,
  getCustomerInvoicesUseCase,
  getCustomerByUserIdUseCase,
  updateInvoiceUseCase,
  deleteInvoiceUseCase,
} from "../useCases/index.js";
import { type Invoice, type InvoicePaymentStatus } from "../models/Invoice.js";

const mapToDTO = (inv: Invoice): InvoiceDataDTO => {
  const mapPopulated = (obj: any) => {
    if (!obj || typeof obj !== "object") return obj;
    return { ...obj, _id: obj.id || obj._id };
  };

  return {
    _id: inv.id,
    MaHD: inv.code,
    PhieuThuePhong: mapPopulated(inv.rentalSlip) || inv.rentalSlipId,
    NhanVienThuNgan: mapPopulated(inv.cashierStaff) || inv.cashierStaffId,
    KhachHang: mapPopulated(inv.customer) || inv.customerId,
    NgayLap: inv.invoiceDate,
    TongTienPhong: inv.roomTotal,
    TongTienDichVu: inv.serviceTotal,
    PhuThu: inv.surcharge,
    TienBoiThuong: inv.damageCharge,
    TienDaCoc: inv.deposit,
    TongThanhToan: inv.grandTotal,
    PhuongThucThanhToan: mapPopulated(inv.paymentMethod) || inv.paymentMethodId,
    TrangThaiThanhToan: inv.paymentStatus,
    ChiTietHoaDon: inv.details.map(d => ({
      MaCTHD: d.code,
      TenHang: d.itemName,
      SoLuong: d.quantity,
      DonGia: d.unitPrice,
      ThanhTien: d.totalAmount,
    })),
    createdAt: inv.createdAt,
    updatedAt: inv.updatedAt,
  };
};

const invoiceController = {
  createInvoice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateInvoiceRequestDTO;
      const userId = (req as any).user?.id;

      if (!body.PhieuThuePhong || !body.PhuongThucThanhToan) {
        res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        return;
      }

      const result = await createInvoiceUseCase.execute({
        rentalSlipId: body.PhieuThuePhong,
        cashierUserId: userId, // Lấy từ Token
        customerId: body.KhachHang,
        paymentMethodId: body.PhuongThucThanhToan,
        roomTotal: body.TongTienPhong,
        serviceTotal: body.TongTienDichVu,
        surcharge: body.PhuThu,
        damageCharge: body.TienBoiThuong,
        deposit: body.TienDaCoc,
        details: body.ChiTietHoaDon?.map(d => ({
          itemName: d.TenHang,
          quantity: d.SoLuong,
          unitPrice: d.DonGia,
          totalAmount: d.ThanhTien,
        })),
      });

      res.status(201).json({ success: true, message: "Tạo hóa đơn thành công", data: mapToDTO(result) });
    } catch (error) {
      next(error);
    }
  },

  createCheckoutInvoice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateCheckoutInvoiceRequestDTO;
      const userId = (req as any).user?.id;

      if (!body.PhieuThuePhong || !body.PhuongThucThanhToan) {
        res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        return;
      }

      const result = await createCheckoutInvoiceUseCase.execute({
        rentalSlipId: body.PhieuThuePhong,
        cashierUserId: userId,
        customerId: body.KhachHang,
        paymentMethodId: body.PhuongThucThanhToan,
        roomTotal: body.TongTienPhong,
        surcharge: body.PhuThu,
        damageCharge: body.TienBoiThuong,
        deposit: body.TienDaCoc,
      });

      res.status(201).json({ success: true, message: "Tạo hóa đơn checkout thành công", data: mapToDTO(result) });
    } catch (error) {
      next(error);
    }
  },

  getPreview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phieuId = req.query.phieuId as string;
      if (!phieuId) {
        res.status(400).json({ success: false, message: "Thiếu phieuId" });
        return;
      }

      const result = await getPreviewInvoiceUseCase.execute({ rentalSlipId: phieuId });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  getAllInvoices: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllInvoicesUseCase.execute({});
      res.status(200).json({ success: true, data: result.map(mapToDTO) });
    } catch (error) {
      next(error);
    }
  },

  getInvoiceById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getInvoiceByIdUseCase.execute({ id: req.params.id as string });
      
      // Ownership check for Customer
      const user = (req as any).user;
      if (user.role === "Customer") {
        const customer = await getCustomerByUserIdUseCase.execute({ userId: user.id });
        if (!customer || result.customerId !== customer.id) {
          res.status(403).json({ success: false, message: "Bạn không có quyền xem hóa đơn này" });
          return;
        }
      }

      res.status(200).json({ success: true, data: mapToDTO(result) });
    } catch (error) {
      next(error);
    }
  },

  getMyInvoices: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await getCustomerInvoicesUseCase.execute({ userId });
      res.status(200).json({ success: true, data: result.map(mapToDTO) });
    } catch (error) {
      next(error);
    }
  },

  updateInvoice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentStatus = req.body.TrangThaiThanhToan as InvoicePaymentStatus | undefined;
      const result = await updateInvoiceUseCase.execute({
        id: req.params.id as string,
        paymentStatus,
      });
      res.status(200).json({ success: true, message: "Cập nhật thành công", data: mapToDTO(result) });
    } catch (error) {
      next(error);
    }
  },

  deleteInvoice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteInvoiceUseCase.execute({ id: req.params.id as string });
      res.status(200).json({ success: true, message: "Xóa hóa đơn thành công" });
    } catch (error) {
      next(error);
    }
  },
};

export default invoiceController;
