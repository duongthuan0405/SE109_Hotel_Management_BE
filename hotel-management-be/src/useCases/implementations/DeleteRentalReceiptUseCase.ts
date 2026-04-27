import {
  type IDeleteRentalReceiptUseCase,
  type DeleteRentalReceiptUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository } from "../../repository/index.js";

export const deleteRentalReceipt: IDeleteRentalReceiptUseCase = {
  execute: async (input: DeleteRentalReceiptUCInput): Promise<RentalSlip> => {
    const slip = await rentalReceiptRepository.findById(input.id);
    if (!slip) {
      throw new Error("Phiếu thuê phòng không tồn tại");
    }

    const deleted = await rentalReceiptRepository.delete(input.id);
    if (!deleted) {
      throw new Error("Lỗi khi xóa phiếu thuê phòng");
    }

    return slip;
  },
};
