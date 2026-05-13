import { type ICreateCheckoutInvoiceUseCase, type CreateCheckoutInvoiceUCInput, type CreateInvoiceDetailUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { serviceUsageRepository, rentalReceiptRepository, staffRepository, unitOfWork } from "../../repository/index.js";
import { getPreviewInvoice } from "./GetPreviewInvoiceUseCase.js";
import { createInvoice } from "./CreateInvoiceUseCase.js";
import { checkOut as checkOutUseCase } from "./CheckOutUseCase.js";

export const createCheckoutInvoice: ICreateCheckoutInvoiceUseCase = {
  execute: async (input: CreateCheckoutInvoiceUCInput): Promise<Invoice> => {
    return await unitOfWork.runInTransaction(async () => {
      // 1. Tìm Staff từ UserID
      const staff = await staffRepository.findByUserId(input.cashierUserId);
      if (!staff) {
        throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
      }

      // 2. Lấy thông tin Preview để tính toán tự động cho toàn đơn đặt phòng
      const preview = await getPreviewInvoice.execute({ bookingId: input.bookingId });

      const customerId = input.customerId || preview.customerId;
      const roomTotal = input.roomTotal ?? preview.roomTotal;
      const deposit = input.deposit ?? preview.deposit;

      // 3. Xây dựng chi tiết hóa đơn từ TẤT CẢ DỊCH VỤ của CÁC PHÒNG trong Đơn đặt
      const rentalSlips = await rentalReceiptRepository.findByBookingId(input.bookingId);
      const slipIds = rentalSlips.map(s => s.id);

      const details: CreateInvoiceDetailUCInput[] = [];
      
      // Thêm dòng tiền phòng tổng cộng
      if (roomTotal > 0) {
        details.push({
          itemName: "Tổng tiền các phòng trong Booking",
          quantity: 1,
          unitPrice: roomTotal,
          totalAmount: roomTotal,
        });
      }

      let serviceTotal = 0;
      
      if (slipIds.length > 0) {
        const serviceUsages = await serviceUsageRepository.findByRentalSlipIds(slipIds, { service: true });
        const completedUsages = serviceUsages.filter(u => u.status === "Completed");

        // Thêm từng dòng dịch vụ của từng phòng
        completedUsages.forEach((usage) => {
          details.push({
            itemName: usage.service?.name || `Dịch vụ ${usage.code}`,
            quantity: usage.quantity,
            unitPrice: usage.service?.price || (usage.totalAmount / usage.quantity),
            totalAmount: usage.totalAmount,
          });
          serviceTotal += usage.totalAmount;
        });
      }

      // 4. Tạo Hóa đơn chính thức (Trạng thái mặc định ban đầu là Unpaid)
      const invoice = await createInvoice.execute({
        bookingId: input.bookingId,
        cashierUserId: input.cashierUserId,
        customerId: customerId,
        paymentMethodId: input.paymentMethodId,
        roomTotal,
        serviceTotal,
        surcharge: input.surcharge,
        damageCharge: input.damageCharge,
        deposit,
        details,
      });

      // 5. THỰC HIỆN CHECKOUT CHO TOÀN BỘ PHIẾU THUÊ PHÒNG
      // Điều này sẽ tự động cập nhật trạng thái tất cả phòng liên quan sang trống/dọn dẹp
      for (const slip of rentalSlips) {
        if (slip.status !== "CheckedOut" && slip.status !== "Cancelled") {
          await checkOutUseCase.execute({ 
            id: slip.id,
            executorUserId: input.cashierUserId 
          });
        }
      }

      return invoice;
    });
  },
};

export default createCheckoutInvoice;

