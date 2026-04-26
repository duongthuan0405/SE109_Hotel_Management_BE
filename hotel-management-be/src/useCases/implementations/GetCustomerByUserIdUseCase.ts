import { customerRepository } from "../../repository/index.js";
import { type IGetCustomerByUserIdUseCase, type GetCustomerByUserIdUCInput, type CustomerUCOutput } from "../types/ICustomerUseCases.js";

const getCustomerByUserIdUseCase: IGetCustomerByUserIdUseCase = {
  execute: async (input: GetCustomerByUserIdUCInput): Promise<CustomerUCOutput> => {
    const customer = await customerRepository.findByUserId(input.userId);
    if (!customer) {
      throw { status: 404, message: "Hồ sơ khách hàng không tồn tại" };
    }
    return customer;
  },
};

export default getCustomerByUserIdUseCase;
