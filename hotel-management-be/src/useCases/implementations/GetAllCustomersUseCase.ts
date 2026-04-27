import { customerRepository } from "../../repository/index.js";
import { type IGetAllCustomersUseCase, type CustomerUCOutput } from "../types/ICustomerUseCases.js";

const getAllCustomersUseCase: IGetAllCustomersUseCase = {
  execute: async (): Promise<CustomerUCOutput[]> => {
    return await customerRepository.findAll({ user: true });
  },
};

export default getAllCustomersUseCase;
