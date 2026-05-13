import { type IConfirmInvoicePaymentUseCase, type ConfirmInvoicePaymentUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository, staffRepository, unitOfWork } from "../../repository/index.js";

export const confirmInvoicePayment: IConfirmInvoicePaymentUseCase = {
  execute: async (input: ConfirmInvoicePaymentUCInput): Promise<Invoice> => {
    return await unitOfWork.runInTransaction(async () => {
      // 1. Tìm Staff xác nhận
      const staff = await staffRepository.findByUserId(input.executorUserId);
      if (!staff) {
        throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
      }

      // 2. Tìm Hóa đơn
      const invoice = await invoiceRepository.findById(input.id);
      if (!invoice) {
        throw { status: 404, message: "Hóa đơn không tồn tại" };
      }

      if (invoice.paymentStatus === "Paid") {
        throw { status: 400, message: "Hóa đơn này đã được thanh toán trước đó" };
      }

      // 3. Cập nhật trạng thái sang Paid, có thể cập nhật lại phương thức thanh toán nếu có truyền
      const updatePayload: any = {
        paymentStatus: "Paid",
      };
      
      if (input.paymentMethodId) {
        updatePayload.paymentMethodId = input.paymentMethodId;
      }

      const updated = await invoiceRepository.update(invoice.id, updatePayload, {
        cashierStaff: true,
        customer: true,
        paymentMethod: true,
        booking: true,
        details: true,
      });

      return updated!;
    });
  },
};

export default confirmInvoicePayment;
