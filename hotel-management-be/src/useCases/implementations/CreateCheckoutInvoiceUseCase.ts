import { type ICreateCheckoutInvoiceUseCase, type CreateCheckoutInvoiceUCInput, type CreateInvoiceDetailUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository, serviceUsageRepository, rentalReceiptRepository, bookingRepository, staffRepository, roomRepository, unitOfWork } from "../../repository/index.js";
import { getPreviewInvoice } from "./GetPreviewInvoiceUseCase.js";
import { createInvoice } from "./CreateInvoiceUseCase.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";
import { checkOut as checkOutUseCase } from "./CheckOutUseCase.js";

export const createCheckoutInvoice: ICreateCheckoutInvoiceUseCase = {
  execute: async (input: CreateCheckoutInvoiceUCInput): Promise<Invoice> => {
    return await unitOfWork.runInTransaction(async () => {
      // 1. Tìm Staff từ UserID
      const staff = await staffRepository.findByUserId(input.cashierUserId);
      if (!staff) {
        throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
      }

      // 2. Lấy thông tin Preview để tính toán tự động
      let bookingId = input.bookingId;
      let booking = await bookingRepository.findById(bookingId, { rentalSlips: true });

      // Fallback: Tìm Booking từ RentalSlipId nếu ID truyền vào là RentalSlipId
      if (!booking) {
        const slip = await rentalReceiptRepository.findById(bookingId);
        if (slip) {
          bookingId = slip.bookingId;
          booking = await bookingRepository.findById(bookingId, { rentalSlips: true });
        }
      }

      if (!booking) {
        throw { status: 404, message: "Không tìm thấy Đơn đặt phòng" };
      }

      const preview = await getPreviewInvoice.execute({ bookingId });

      const customerId = preview.customerId;
      const roomTotal = preview.roomTotal;
      const deposit = preview.deposit;
      const surcharge = input.surcharge || 0;
      const damageCharge = input.damageCharge || 0;

      // 3. Xây dựng chi tiết hóa đơn từ các dịch vụ của TẤT CẢ các phòng
      const slips = booking.rentalSlips || [];
      const slipIds = slips.map(s => s.id);
      
      let completedUsages: any[] = [];
      if (slipIds.length > 0) {
        const serviceUsages = await serviceUsageRepository.findByRentalSlipIds(slipIds, { service: true });
        completedUsages = serviceUsages.filter(u => u.status === "Completed");
      }

      const details: CreateInvoiceDetailUCInput[] = [];
      
      // Thêm dòng tiền phòng (Tổng cộng)
      if (roomTotal > 0) {
        details.push({
          itemName: `Tiền phòng (Tổng ${slips.length} phòng)`,
          quantity: 1,
          unitPrice: roomTotal,
          totalAmount: roomTotal,
        });
      }

      let serviceTotal = 0;
      // Thêm các dòng dịch vụ gom từ tất cả các phòng
      completedUsages.forEach((usage) => {
        details.push({
          itemName: `${usage.service?.name || "Dịch vụ"} (P.${slips.find(s => s.id === usage.rentalSlipId)?.room?.code || usage.rentalSlipId.substring(0,8)})`,
          quantity: usage.quantity,
          unitPrice: usage.service?.price || (usage.totalAmount / usage.quantity),
          totalAmount: usage.totalAmount,
        });
        serviceTotal += usage.totalAmount;
      });

      // Thêm dòng Phụ thu nếu có
      if (surcharge > 0) {
        details.push({
          itemName: "Phụ thu / Phí bổ sung",
          quantity: 1,
          unitPrice: surcharge,
          totalAmount: surcharge,
        });
      }

      // Thêm dòng Bồi thường nếu có
      if (damageCharge > 0) {
        details.push({
          itemName: "Phí bồi thường hư hại",
          quantity: 1,
          unitPrice: damageCharge,
          totalAmount: damageCharge,
        });
      }

      // 4. Tạo Hóa đơn chính thức cho cả Booking
      const invoice = await createInvoice.execute({
        bookingId: bookingId,
        cashierUserId: input.cashierUserId,
        customerId: customerId,
        paymentMethodId: input.paymentMethodId,
        roomTotal,
        serviceTotal,
        surcharge: surcharge,
        damageCharge: damageCharge,
        deposit,
        details,
      });

      // 5. THỰC HIỆN CHECKOUT HÀNG LOẠT (Tối ưu hóa)
      const oldBookingStatus = booking.status;
      for (const slip of slips) {
        if (slip.status === "CheckedIn") {
          // Cập nhật Slip
          await rentalReceiptRepository.update(slip.id, { status: "CheckedOut" });
          // Cập nhật Phòng
          await roomRepository.updateStatus(slip.roomId, "Cleaning");
        }
      }

      // Cập nhật trạng thái Đơn đặt phòng
      if (oldBookingStatus !== "CheckedOut") {
        await bookingRepository.updateStatus(booking.id, "CheckedOut");
        
        // Ghi lịch sử 1 lần duy nhất cho cả Booking
        await createBookingHistoryUseCase.execute({
          bookingId: booking.id,
          oldStatus: oldBookingStatus as any,
          newStatus: "CheckedOut",
          userId: input.cashierUserId,
        });
      }

      return invoice;
    });

  },
};

export default createCheckoutInvoice;

