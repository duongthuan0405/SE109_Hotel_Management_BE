import jwt from "jsonwebtoken";
import { type IJwtService, type TokenPayload } from "@/services/types/IJwtService.js";
import env from "@/config/env.js";

const jwtService: IJwtService = {
  generateToken: async (payload: TokenPayload): Promise<string> => {
    return jwt.sign(
      {
        id: payload.id,
        VaiTro: payload.role,
        TenDangNhap: payload.username,
      },
      env.JWT_SECRET,
      { expiresIn: "8h" }
    );
  },
};

export default jwtService;
