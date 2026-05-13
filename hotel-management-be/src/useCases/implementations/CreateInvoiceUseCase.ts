import { type ICreateInvoiceUseCase, type CreateInvoiceUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository, bookingRepository, staffRepository } from "../../repository/index.js";

export const createInvoice: ICreateInvoiceUseCase = {
  execute: async (input: CreateInvoiceUCInput): Promise<Invoice> => {
    // 1. Tìm Staff từ UserID
    const staff = await staffRepository.findByUserId(input.cashierUserId);
    if (!staff) {
      throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
    }

    // 2. Truy xuất Booking
    const booking = await bookingRepository.findById(input.bookingId);
    if (!booking) {
      throw { status: 404, message: "Không tìm thấy Đơn đặt phòng liên quan" };
    }

    // 3. Tự động điền thông tin
    const customerId = input.customerId || booking.customerId;
    if (!customerId) {
      throw { status: 400, message: "Không xác định được Khách hàng" };
    }

    const deposit = input.deposit ?? booking.deposit ?? 0;
    const roomTotal = input.roomTotal ?? 0;
    const serviceTotal = input.serviceTotal ?? 0;
    const surcharge = input.surcharge ?? 0;
    const damageCharge = input.damageCharge ?? 0;

    // TongThanhToan = TongTienPhong + TongTienDichVu + PhuThu + TienBoiThuong - TienDaCoc
    const grandTotal = Math.max(0, roomTotal + serviceTotal + surcharge + damageCharge - deposit);

    const invoice = await invoiceRepository.create({
      bookingId: booking.id,
      cashierStaffId: staff.id,
      customerId,
      paymentMethodId: input.paymentMethodId,
      invoiceDate: new Date(),
      roomTotal,
      serviceTotal,
      surcharge,
      damageCharge,
      deposit,
      grandTotal,
      paymentStatus: "Unpaid", // Theo yêu cầu mới: Khởi tạo ở trạng thái CHƯA THANH TOÁN
      details: input.details || [],
    });

    // Populate đầy đủ quan hệ
    const populated = await invoiceRepository.findById(invoice.id, {
      cashierStaff: true,
      customer: true,
      paymentMethod: true,
      booking: true,
      details: true,
    });

    return populated!;
  },
};

export default createInvoice;
