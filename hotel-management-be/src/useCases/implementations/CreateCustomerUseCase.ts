import { customerRepository } from "../../repository/index.js";
import { type ICreateCustomerUseCase, type CreateCustomerUCInput, type CustomerUCOutput } from "../types/ICustomerUseCases.js";

const createCustomerUseCase: ICreateCustomerUseCase = {
  execute: async (input: CreateCustomerUCInput): Promise<CustomerUCOutput> => {
    const { HoTen, CMND, SDT, Email, DiaChi, TaiKhoanId } = input;

    // Kiểm tra CMND/Email tồn tại
    const existingCMND = await customerRepository.findByIdentityCard(CMND);
    if (existingCMND) {
      throw { status: 409, message: "Số CMND đã tồn tại trong hệ thống" };
    }

    const existingEmail = await customerRepository.findByEmail(Email);
    if (existingEmail) {
      throw { status: 409, message: "Email đã tồn tại trong hệ thống" };
    }

    // Tạo MaKH mới
    const MaKH = await customerRepository.generateNextId();

    const newCustomer = await customerRepository.create({
      customerId: MaKH,
      fullName: HoTen,
      identityCard: CMND,
      phone: SDT,
      email: Email,
      address: DiaChi,
      userId: TaiKhoanId,
    });

    return newCustomer;
  },
};

export default createCustomerUseCase;
