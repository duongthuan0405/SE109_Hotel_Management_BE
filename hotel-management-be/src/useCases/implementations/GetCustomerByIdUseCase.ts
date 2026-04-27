import { customerRepository } from "../../repository/index.js";
import { type IGetCustomerByIdUseCase, type GetCustomerByIdUCInput, type CustomerUCOutput } from "../types/ICustomerUseCases.js";

const getCustomerByIdUseCase: IGetCustomerByIdUseCase = {
  execute: async (input: GetCustomerByIdUCInput): Promise<CustomerUCOutput> => {
    const customer = await customerRepository.findById(input.id, { user: true });
    if (!customer) {
      throw { status: 404, message: "Khách hàng không tồn tại" };
    }
    return customer;
  },
};

export default getCustomerByIdUseCase;
