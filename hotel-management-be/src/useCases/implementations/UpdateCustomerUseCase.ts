import { customerRepository } from "../../repository/index.js";
import { type IUpdateCustomerUseCase, type UpdateCustomerUCInput, type CustomerUCOutput } from "../types/ICustomerUseCases.js";

const updateCustomerUseCase: IUpdateCustomerUseCase = {
  execute: async (input: UpdateCustomerUCInput): Promise<CustomerUCOutput> => {
    const { id, ...data } = input;

    const existingCustomer = await customerRepository.findById(id);
    if (!existingCustomer) {
      throw { status: 404, message: "Khách hàng không tồn tại" };
    }

    const updatedCustomer = await customerRepository.update(id, {
      fullName: data.fullName as string,
      identityCard: data.identityCard as string,
      phone: data.phone as string,
      email: data.email as string,
      address: data.address as string,
    });

    if (!updatedCustomer) {
      throw { status: 500, message: "Lỗi khi cập nhật khách hàng" };
    }

    return updatedCustomer;
  },
};

export default updateCustomerUseCase;
