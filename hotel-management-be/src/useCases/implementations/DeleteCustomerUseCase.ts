import { customerRepository } from "../../repository/index.js";
import { type IDeleteCustomerUseCase, type DeleteCustomerUCInput } from "../types/ICustomerUseCases.js";

const deleteCustomerUseCase: IDeleteCustomerUseCase = {
  execute: async (input: DeleteCustomerUCInput): Promise<void> => {
    const success = await customerRepository.delete(input.id);
    if (!success) {
      throw { status: 404, message: "Khách hàng không tồn tại" };
    }
  },
};

export default deleteCustomerUseCase;
