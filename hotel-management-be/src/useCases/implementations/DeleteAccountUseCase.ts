import { userRepository } from "../../repository/index.js";
import { type IDeleteAccountUseCase, type DeleteAccountUCInput } from "../types/IAccountUseCases.js";

const deleteAccountUseCase: IDeleteAccountUseCase = {
  execute: async (input: DeleteAccountUCInput): Promise<void> => {
    const isDeleted = await userRepository.deleteById(input.id);
    if (!isDeleted) {
      throw { status: 404, message: "Tài khoản không tồn tại" };
    }
  },
};

export default deleteAccountUseCase;
