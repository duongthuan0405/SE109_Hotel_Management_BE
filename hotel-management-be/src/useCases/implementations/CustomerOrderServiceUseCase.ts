import {
  type ICustomerOrderServiceUseCase,
  type CustomerOrderServiceUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import {
  serviceUsageRepository,
  customerRepository,
  serviceRepository,
  rentalReceiptRepository,
  bookingRepository,
} from "../../repository/index.js";

export const customerOrderService: ICustomerOrderServiceUseCase = {
  execute: async (input: CustomerOrderServiceUCInput): Promise<ServiceUsage> => {
    // 1. Tìm khách hàng
    const customer = await customerRepository.findByUserId(input.userId);
    if (!customer) {
      throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };
    }

    // 2. Kiểm tra phiếu thuê phòng
    const rentalSlip = await rentalReceiptRepository.findById(input.rentalSlipId);
    if (!rentalSlip) {
      throw { status: 404, message: "Phiếu thuê phòng không tồn tại" };
    }

    // 3. Xác minh quyền sở hữu (RentalSlip -> Booking -> Customer)
    const booking = await bookingRepository.findById(rentalSlip.bookingId);
    if (!booking || booking.customerId !== customer.id) {
      throw { status: 403, message: "Bạn không có quyền đặt dịch vụ cho phòng này" };
    }

    // 4. Lấy thông tin dịch vụ và giá
    const service = await serviceRepository.findById(input.serviceId);
    if (!service) {
      throw { status: 404, message: "Dịch vụ không tồn tại" };
    }

    // 5. Tạo mã sử dụng dịch vụ tự động
    const count = await serviceUsageRepository.countAll();
    const code = `SDDV${String(count + 1).padStart(3, "0")}`;

    // 6. Tạo mới với trạng thái Pending
    const usage = await serviceUsageRepository.create({
      code,
      rentalSlipId: input.rentalSlipId,
      serviceId: input.serviceId,
      quantity: input.quantity,
      unitPrice: service.price,
      totalAmount: input.quantity * service.price,
      requestedAt: new Date(),
      status: "Pending",
    });

    // 7. Trả về kèm data đã populated
    const populated = await serviceUsageRepository.findById(usage.id, {
      rentalSlip: true,
      service: true,
    });

    return populated!;
  },
};
