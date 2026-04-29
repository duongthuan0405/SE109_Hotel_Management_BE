import { customerRepository } from "../../repository/index.js";
import { type ICreateCustomerUseCase, type CreateCustomerUCInput, type CustomerUCOutput } from "../types/ICustomerUseCases.js";

const createCustomerUseCase: ICreateCustomerUseCase = {
  execute: async (input: CreateCustomerUCInput): Promise<CustomerUCOutput> => {
    const { fullName, identityCard, phone, email, address, userId } = input;

    // Kiểm tra CMND/Email tồn tại
    const existingCMND = await customerRepository.findByIdentityCard(identityCard);
    if (existingCMND) {
      throw { status: 409, message: "Số CMND đã tồn tại trong hệ thống" };
    }

    const existingEmail = await customerRepository.findByEmail(email);
    if (existingEmail) {
      throw { status: 409, message: "Email đã tồn tại trong hệ thống" };
    }

    const newCustomer = await customerRepository.create({
      fullName,
      identityCard,
      phone,
      email,
      address,
      userId,
    });

    const populatedCustomer = await customerRepository.findById(newCustomer.id, { user: true });

    return populatedCustomer!;
  },
};

export default createCustomerUseCase;
