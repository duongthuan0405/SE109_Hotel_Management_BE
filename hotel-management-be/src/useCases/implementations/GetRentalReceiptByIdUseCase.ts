import {
  type IGetRentalReceiptByIdUseCase,
  type GetRentalReceiptByIdUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository } from "../../repository/index.js";

export const getRentalReceiptById: IGetRentalReceiptByIdUseCase = {
  execute: async (input: GetRentalReceiptByIdUCInput): Promise<RentalSlip> => {
    const slip = await rentalReceiptRepository.findById(input.id);
    if (!slip) {
      throw new Error("Phiếu thuê phòng không tồn tại");
    }
    return slip;
  },
};
