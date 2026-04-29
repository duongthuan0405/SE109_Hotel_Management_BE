import { type ICreateCheckoutInvoiceUseCase, type CreateCheckoutInvoiceUCInput, type CreateInvoiceDetailUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice, type InvoiceDetail } from "../../models/Invoice.js";
import { invoiceRepository, serviceUsageRepository, rentalReceiptRepository, bookingRepository, staffRepository } from "../../repository/index.js";
import { getPreviewInvoice } from "./GetPreviewInvoiceUseCase.js";
import { createInvoice } from "./CreateInvoiceUseCase.js";
import { checkOut as checkOutUseCase } from "./CheckOutUseCase.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";

export const createCheckoutInvoice: ICreateCheckoutInvoiceUseCase = {
  execute: async (input: CreateCheckoutInvoiceUCInput): Promise<Invoice> => {
    // 1. Tìm Staff từ UserID
    const staff = await staffRepository.findByUserId(input.cashierUserId);
    if (!staff) {
      throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
    }

    // 2. Lấy thông tin Preview để tính toán tự động
    const preview = await getPreviewInvoice.execute({ rentalSlipId: input.rentalSlipId });

    const customerId = input.customerId || preview.customerId;
    const roomTotal = input.roomTotal ?? preview.roomTotal;
    const deposit = input.deposit ?? preview.deposit;

    // 2. Xây dựng chi tiết hóa đơn từ các dịch vụ đã sử dụng
    const serviceUsages = await serviceUsageRepository.findByRentalSlipIds([input.rentalSlipId], { service: true });
    const completedUsages = serviceUsages.filter(u => u.status === "Completed");

    const details: CreateInvoiceDetailUCInput[] = [];
    
    // Thêm dòng tiền phòng
    if (roomTotal > 0) {
      details.push({
        itemName: "Tiền phòng",
        quantity: 1,
        unitPrice: roomTotal,
        totalAmount: roomTotal,
      });
    }

    let serviceTotal = 0;
    // Thêm các dòng dịch vụ
    completedUsages.forEach((usage, index) => {
      details.push({
        itemName: usage.service?.name || `Dịch vụ ${usage.code}`,
        quantity: usage.quantity,
        unitPrice: usage.service?.price || (usage.totalAmount / usage.quantity),
        totalAmount: usage.totalAmount,
      });
      serviceTotal += usage.totalAmount;
    });

    // 3. Tạo Hóa đơn chính thức
    const invoice = await createInvoice.execute({
      rentalSlipId: input.rentalSlipId,
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

    // 4. THỰC HIỆN CHECKOUT TỰ ĐỘNG (Gọi UseCase tập trung)
    await checkOutUseCase.execute({ 
      id: input.rentalSlipId,
      executorUserId: input.cashierUserId 
    });

    return invoice;
  },
};

export default createCheckoutInvoice;
