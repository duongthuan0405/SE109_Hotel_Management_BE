import { userRepository } from "../../repository/index.js";
import { type IGetAllAccountsUseCase, type AccountUCOutput } from "../types/IAccountUseCases.js";

const getAllAccountsUseCase: IGetAllAccountsUseCase = {
  execute: async (): Promise<AccountUCOutput[]> => {
    const users = await userRepository.findAll();
    return users.map(user => {
      const { passwordHash, ...rest } = user;
      return rest;
    });
  },
};

export default getAllAccountsUseCase;
