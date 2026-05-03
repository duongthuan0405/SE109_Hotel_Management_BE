import { type Request, type Response, type NextFunction } from "express";
import { type LoginRequestDTO, type LoginResponseDTO, type RegisterRequestDTO, type RegisterResponseDTO, type ForgotPasswordRequestDTO, type ForgotPasswordResponseDTO, type ResetPasswordRequestDTO, type ResetPasswordResponseDTO } from "../dtos/AuthDTO.js";
import { loginUseCase, registerUseCase, forgotPasswordUseCase, resetPasswordUseCase } from "../useCases/index.js";
import type { LoginUCInput } from "../useCases/types/ILoginUseCase.js";
import type { RegisterUCInput } from "../useCases/types/IRegisterUseCase.js";

const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RegisterRequestDTO;
      const input: RegisterUCInput = {
        username: body.TenDangNhap,
        password: body.MatKhau,
      };
      
      if (body.HoTen !== undefined) input.fullName = body.HoTen;
      if (body.CMND !== undefined) input.identityCard = body.CMND;
      if (body.SDT !== undefined) input.phone = body.SDT;
      if (body.Email !== undefined) input.email = body.Email;
      if (body.DiaChi !== undefined) input.address = body.DiaChi;

      const result = await registerUseCase.execute(input);

      const response: RegisterResponseDTO = {
        id: result.id,
        TenDangNhap: result.username,
        VaiTro: result.role,
      };

      res.status(201).json({ success: true, message: "Đăng ký tài khoản thành công", data: response });

    } catch (error) {
      next(error);
    }

  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as LoginRequestDTO;
      
      const input: LoginUCInput = {
        username: body.TenDangNhap,
        password: body.MatKhau,
      };

      const result = await loginUseCase.execute(input);

      const response: LoginResponseDTO = {
        token: result.token,
        VaiTro: result.role,
      };

      res.status(200).json({ success: true, message: "Đăng nhập thành công", data: response });

    } catch (error) {
      next(error);
    }

  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as ForgotPasswordRequestDTO;
      const input = { email: body.Email };
      const result = await forgotPasswordUseCase.execute(input);
      const response: ForgotPasswordResponseDTO = {
        message: result.message,
      };
      if (result.otp !== undefined) response.otp = result.otp;

      res.status(200).json({ success: true, message: "Yêu cầu đặt lại mật khẩu đã được gửi", data: response });

    } catch (error) {
      next(error);
    }

  },
  resetPasswordWithOTP: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as ResetPasswordRequestDTO;
      const input = {
        email: body.Email,
        otp: body.OTP,
        newPassword: body.MatKhau,
      };
      const result = await resetPasswordUseCase.execute(input);
      const response: ResetPasswordResponseDTO = {
        message: result.message,
      };
      res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công", data: response });

    } catch (error) {
      next(error);
    }

  }
};

export default authController;
