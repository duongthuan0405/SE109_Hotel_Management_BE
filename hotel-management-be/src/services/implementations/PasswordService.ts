import bcrypt from "bcryptjs";
import { type IPasswordService } from "../types/IPasswordService.js";

const passwordService: IPasswordService = {
  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  },
};

export default passwordService;
