import { type Request, type Response, type NextFunction } from "express";
import { type UpdateAccountRequestDTO, type ChangePasswordRequestDTO, type AccountDataDTO, type AccountResponseWrapper, type CreateAccountRequestDTO } from "../dtos/AccountDTO.js";
import {
  getAccountByIdUseCase,
  updateAccountUseCase,
  changePasswordUseCase,
  getAllAccountsUseCase,
  createAccountUseCase,
  deleteAccountUseCase,
} from "../useCases/index.js";
import type { AccountUCOutput, UpdateAccountUCInput } from "../useCases/types/IAccountUseCases.js";

const mapToDTO = (account: AccountUCOutput): AccountDataDTO => ({
  _id: account.id,
  TenDangNhap: account.username,
  VaiTro: account.role,
});

const accountController = {
  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const result = await getAccountByIdUseCase.execute({ id: currentUser.id });
      const response: AccountResponseWrapper<AccountDataDTO> = {
        success: true,
        message: "Lấy thông tin tài khoản cá nhân thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: AccountResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin tài khoản",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },


  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const targetId = currentUser.id;
      
      const body = req.body as ChangePasswordRequestDTO;
      await changePasswordUseCase.execute({
        id: targetId,
        oldPassword: body.MatKhauCu,
        newPassword: body.MatKhauMoi,
      });
      const response: AccountResponseWrapper<undefined> = {
        success: true,
        message: "Thay đổi mật khẩu thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: AccountResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi thay đổi mật khẩu",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  getAllAccounts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllAccountsUseCase.execute();
      const response: AccountResponseWrapper<AccountDataDTO[]> = {
        success: true,
        message: "Lấy danh sách tài khoản thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: AccountResponseWrapper<undefined> = {
        success: false,
        message: "Lỗi khi lấy danh sách tài khoản",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  getAccountById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const targetId = req.params.id as string;
      
      if (currentUser.role !== "Admin" && currentUser.id !== targetId) {
        res.status(403).json({ success: false, message: "Bạn không có quyền lấy thông tin tài khoản này" });
        return;
      }

      const result = await getAccountByIdUseCase.execute({ id: targetId });
      const response: AccountResponseWrapper<AccountDataDTO> = {
        success: true,
        message: "Lấy thông tin tài khoản thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: AccountResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin tài khoản",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  createAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateAccountRequestDTO;
      const result = await createAccountUseCase.execute({
        username: body.TenDangNhap,
        password: body.MatKhau,
        role: body.VaiTro,
      });
      const response: AccountResponseWrapper<AccountDataDTO> = {
        success: true,
        message: "Tạo tài khoản thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: AccountResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi tạo tài khoản",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  updateAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateAccountRequestDTO;
      
      const input: UpdateAccountUCInput = { id: req.params.id as string };
      if (body.VaiTro !== undefined) input.role = body.VaiTro;

      const result = await updateAccountUseCase.execute(input);
      const response: AccountResponseWrapper<AccountDataDTO> = {
        success: true,
        message: "Cập nhật tài khoản thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: AccountResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật tài khoản",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const targetId = req.params.id as string;

      if (currentUser.role !== "Admin" && currentUser.id !== targetId) {
        res.status(403).json({ success: false, message: "Bạn không có quyền xóa tài khoản này" });
        return;
      }

      await deleteAccountUseCase.execute({ id: targetId });
      const response: AccountResponseWrapper<undefined> = {
        success: true,
        message: "Xóa tài khoản thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: AccountResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi xóa tài khoản",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },
};

export default accountController;
