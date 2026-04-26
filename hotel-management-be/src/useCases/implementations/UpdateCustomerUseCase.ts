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
      fullName: data.HoTen as string,
      identityCard: data.CMND as string,
      phone: data.SDT as string,
      email: data.Email as string,
      address: data.DiaChi as string,
    });

    if (!updatedCustomer) {
      throw { status: 500, message: "Lỗi khi cập nhật khách hàng" };
    }

    return updatedCustomer;
  },
};

export default updateCustomerUseCase;
