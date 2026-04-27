import { type Request, type Response, type NextFunction } from "express";
import {
  getAllCustomersUseCase,
  getCustomerByIdUseCase,
  getCustomerByUserIdUseCase,
  createCustomerUseCase,
  updateCustomerUseCase,
  deleteCustomerUseCase,
} from "../useCases/index.js";
import {
  type CustomerDataDTO,
  type CustomerResponseWrapper,
  type CreateCustomerRequestDTO,
  type UpdateCustomerRequestDTO,
} from "../dtos/CustomerDTO.js";
import { type CustomerUCOutput } from "../useCases/types/ICustomerUseCases.js";

const mapToDTO = (customer: CustomerUCOutput): CustomerDataDTO => ({
  _id: customer.id,
  MaKH: customer.customerId,
  HoTen: customer.fullName,
  CMND: customer.identityCard,
  SDT: customer.phone,
  Email: customer.email,
  DiaChi: customer.address,
  TaiKhoanId: customer.userId,
});

const customerController = {
  getAllCustomers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllCustomersUseCase.execute();
      const response: CustomerResponseWrapper<CustomerDataDTO[]> = {
        success: true,
        message: "Lấy danh sách khách hàng thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: CustomerResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy danh sách khách hàng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  getCustomerById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await getCustomerByIdUseCase.execute({ id });
      const response: CustomerResponseWrapper<CustomerDataDTO> = {
        success: true,
        message: "Lấy thông tin khách hàng thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: CustomerResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin khách hàng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  getMyProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const result = await getCustomerByUserIdUseCase.execute({ userId: currentUser.id });
      const response: CustomerResponseWrapper<CustomerDataDTO> = {
        success: true,
        message: "Lấy hồ sơ cá nhân thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: CustomerResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy hồ sơ cá nhân",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  createCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateCustomerRequestDTO;
      const result = await createCustomerUseCase.execute({
        fullName: body.HoTen,
        identityCard: body.CMND,
        phone: body.SDT,
        email: body.Email,
        address: body.DiaChi,
        userId: body.TaiKhoanId,
      });
      const response: CustomerResponseWrapper<CustomerDataDTO> = {
        success: true,
        message: "Tạo khách hàng thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: CustomerResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi tạo khách hàng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  updateCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const body = req.body as UpdateCustomerRequestDTO;
      const result = await updateCustomerUseCase.execute({
        id,
        fullName: body.HoTen,
        identityCard: body.CMND,
        phone: body.SDT,
        email: body.Email,
        address: body.DiaChi,
      });
      const response: CustomerResponseWrapper<CustomerDataDTO> = {
        success: true,
        message: "Cập nhật thông tin khách hàng thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: CustomerResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật thông tin khách hàng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  updateMyProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const profile = await getCustomerByUserIdUseCase.execute({ userId: currentUser.id });
      
      const body = req.body as UpdateCustomerRequestDTO;
      const result = await updateCustomerUseCase.execute({
        id: profile.id,
        fullName: body.HoTen,
        identityCard: body.CMND,
        phone: body.SDT,
        email: body.Email,
        address: body.DiaChi,
      });
      
      const response: CustomerResponseWrapper<CustomerDataDTO> = {
        success: true,
        message: "Cập nhật hồ sơ cá nhân thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: CustomerResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật hồ sơ cá nhân",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  deleteCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await deleteCustomerUseCase.execute({ id });
      const response: CustomerResponseWrapper<undefined> = {
        success: true,
        message: "Xóa khách hàng thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: CustomerResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi xóa khách hàng",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },
};

export default customerController;
