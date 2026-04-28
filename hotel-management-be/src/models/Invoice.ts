import { type RentalSlip } from "./RentalSlip.js";
import { type Staff } from "./Staff.js";
import { type Customer } from "./Customer.js";
import { type PaymentMethod } from "./PaymentMethod.js";

export type InvoicePaymentStatus = 'Unpaid' | 'Paid' | 'PartiallyPaid' | 'Refunded';

export type InvoiceDetail = {
  code: string; // MaCTHD
  itemName: string; // TenHang
  quantity: number; // SoLuong
  unitPrice: number; // DonGia
  totalAmount: number; // ThanhTien
};

export type Invoice = {
  id: string;
  code: string; // MaHD
  rentalSlipId: string; // PhieuThuePhong
  rentalSlip?: RentalSlip | undefined;
  cashierStaffId: string; // NhanVienThuNgan
  cashierStaff?: Staff | undefined;
  customerId: string; // KhachHang
  customer?: Customer | undefined;
  invoiceDate: Date; // NgayLap
  roomTotal: number; // TongTienPhong
  serviceTotal: number; // TongTienDichVu
  surcharge: number; // PhuThu
  damageCharge: number; // TienBoiThuong
  deposit: number; // TienDaCoc
  grandTotal: number; // TongThanhToan
  paymentMethodId: string; // PhuongThucThanhToan
  paymentMethod?: PaymentMethod | undefined;
  paymentStatus: InvoicePaymentStatus; // TrangThaiThanhToan
  details: InvoiceDetail[]; // ChiTietHoaDon
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
