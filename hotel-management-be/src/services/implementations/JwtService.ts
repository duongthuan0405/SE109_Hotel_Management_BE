import jwt from "jsonwebtoken";
import { type IJwtService, type TokenPayload } from "../types/IJwtService.js";
import env from "../../config/env.js";

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
  verifyToken: (token: string): TokenPayload => {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    return {
      id: decoded.id,
      role: decoded.VaiTro,
      username: decoded.TenDangNhap,
    };
  },
};

export default jwtService;
