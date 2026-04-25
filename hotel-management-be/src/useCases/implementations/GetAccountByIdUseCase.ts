import { userRepository, userProfileRepository } from "../../repository/index.js";
import { type IGetAccountByIdUseCase, type GetAccountByIdUCInput, type AccountUCOutput } from "../types/IAccountUseCases.js";

const getAccountByIdUseCase: IGetAccountByIdUseCase = {
  execute: async (input: GetAccountByIdUCInput): Promise<AccountUCOutput> => {
    const user = await userRepository.findById(input.id);
    if (!user) {
      throw { status: 404, message: "Tài khoản không tồn tại" };
    }
    
    const profile = await userProfileRepository.findByUserId(input.id);
    
    const { passwordHash, ...rest } = user;
    if (profile) {
      const { id: _, userId: __, ...profileData } = profile;
      return { ...rest, ...profileData };
    }
    
    return rest;
  },
};

export default getAccountByIdUseCase;
