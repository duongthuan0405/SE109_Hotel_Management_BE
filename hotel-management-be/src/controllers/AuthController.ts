import { type Request, type Response, type NextFunction } from "express";
import { type LoginRequestDTO, type LoginResponseDTO } from "@/dtos/AuthDTO.js";
import { loginUseCase } from "@/useCases/index.js";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as LoginRequestDTO;
      
      const input = {
        username: body.TenDangNhap,
        password: body.MatKhau,
      };

      // Call UseCase
      const result = await loginUseCase.execute(input);

      // Map UCOutput to DTO
      const response: LoginResponseDTO = {
        token: result.token,
        VaiTro: result.role,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
