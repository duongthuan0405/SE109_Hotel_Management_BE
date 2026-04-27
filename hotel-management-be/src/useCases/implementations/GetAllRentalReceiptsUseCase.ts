import { type IGetAllRentalReceiptsUseCase } from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository } from "../../repository/index.js";

export const getAllRentalReceipts: IGetAllRentalReceiptsUseCase = {
  execute: async (): Promise<RentalSlip[]> => {
    return rentalReceiptRepository.findAll();
  },
};
