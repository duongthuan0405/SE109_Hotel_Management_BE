import {
  type IUpdateRentalReceiptUseCase,
  type UpdateRentalReceiptUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository } from "../../repository/index.js";

export const updateRentalReceipt: IUpdateRentalReceiptUseCase = {
  execute: async (input: UpdateRentalReceiptUCInput): Promise<RentalSlip> => {
    const updateData: Parameters<typeof rentalReceiptRepository.update>[1] = {};
    if (input.expectedCheckOutDate !== undefined) updateData.expectedCheckOutDate = input.expectedCheckOutDate;
    if (input.adjustedPrice !== undefined) updateData.adjustedPrice = input.adjustedPrice;
    if (input.status !== undefined) updateData.status = input.status;

    const updated = await rentalReceiptRepository.update(input.id, updateData);

    if (!updated) {
      throw { status: 404, message: "Phiếu thuê phòng không tồn tại" };
    }

    return updated;
  },
};
