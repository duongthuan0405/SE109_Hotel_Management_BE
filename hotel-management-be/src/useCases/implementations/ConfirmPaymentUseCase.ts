import { type IConfirmPaymentUseCase, type ConfirmPaymentUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository, staffRepository } from "../../repository/index.js";

export const confirmPayment: IConfirmPaymentUseCase = {
  execute: async (input: ConfirmPaymentUCInput): Promise<Invoice> => {
    // 1. Kiểm tra hóa đơn tồn tại
    const invoice = await invoiceRepository.findById(input.invoiceId);
    if (!invoice) {
      throw { status: 404, message: "Không tìm thấy hóa đơn" };
    }

    if (invoice.paymentStatus === "Paid") {
      throw { status: 400, message: "Hóa đơn đã được thanh toán trước đó" };
    }

    // 2. Kiểm tra nhân viên thực hiện
    const staff = await staffRepository.findByUserId(input.cashierUserId);
    if (!staff) {
      throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
    }

    // 3. Cập nhật trạng thái thanh toán và phương thức thanh toán
    const updatedInvoice = await invoiceRepository.update(invoice.id, {
      paymentStatus: "Paid",
      paymentMethodId: input.paymentMethodId,
      cashierStaffId: staff.id, // Cập nhật người xác nhận thanh toán nếu cần
    });

    if (!updatedInvoice) {
      throw { status: 500, message: "Cập nhật hóa đơn thất bại" };
    }

    // Populate lại dữ liệu đầy đủ
    const populated = await invoiceRepository.findById(updatedInvoice.id, {
      cashierStaff: true,
      customer: true,
      paymentMethod: true,
      booking: true,
      details: true,
    });

    return populated!;
  },
};

export default confirmPayment;
