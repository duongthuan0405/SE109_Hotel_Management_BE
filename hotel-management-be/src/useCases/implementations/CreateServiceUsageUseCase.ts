import {
  type ICreateServiceUsageUseCase,
  type CreateServiceUsageUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository } from "../../repository/index.js";

export const createServiceUsage: ICreateServiceUsageUseCase = {
  execute: async (input: CreateServiceUsageUCInput): Promise<ServiceUsage> => {
    // 1. Auto-gen mã nếu thiếu
    let code = input.code;
    if (!code) {
      const count = await serviceUsageRepository.countAll();
      code = `SDDV${String(count + 1).padStart(3, "0")}`;
    }

    // 2. Kiểm tra mã trùng
    const existing = await serviceUsageRepository.findByCode(code);
    if (existing) {
      throw { status: 409, message: "Mã sử dụng dịch vụ đã tồn tại" };
    }

    // 3. Tạo mới
    const usage = await serviceUsageRepository.create({
      code,
      rentalSlipId: input.rentalSlipId,
      serviceId: input.serviceId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      totalAmount: input.totalAmount,
      requestedAt: input.requestedAt || new Date(),
      status: "Completed",
    });

    // 4. Trả về với populated data
    const populated = await serviceUsageRepository.findById(usage.id, {
      rentalSlip: true,
      service: true,
    });

    return populated!;
  },
};
