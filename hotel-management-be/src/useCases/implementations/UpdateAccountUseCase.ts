import { userRepository, userProfileRepository } from "../../repository/index.js";
import { type IUpdateAccountUseCase, type UpdateAccountUCInput, type AccountUCOutput } from "../types/IAccountUseCases.js";

const updateAccountUseCase: IUpdateAccountUseCase = {
  execute: async (input: UpdateAccountUCInput): Promise<AccountUCOutput> => {
    const { id, fullName, identityCard, phone, email, address } = input;

    const user = await userRepository.findById(id);
    if (!user) {
      throw { status: 404, message: "Tài khoản không tồn tại" };
    }

    let profile = await userProfileRepository.findByUserId(id);
    if (!profile) {
      const createInput: any = { userId: id };
      if (fullName !== undefined) createInput.fullName = fullName;
      if (identityCard !== undefined) createInput.identityCard = identityCard;
      if (phone !== undefined) createInput.phone = phone;
      if (email !== undefined) createInput.email = email;
      if (address !== undefined) createInput.address = address;

      profile = await userProfileRepository.create(createInput);
    } else {
      if (fullName !== undefined) profile.fullName = fullName;
      if (identityCard !== undefined) profile.identityCard = identityCard;
      if (phone !== undefined) profile.phone = phone;
      if (email !== undefined) profile.email = email;
      if (address !== undefined) profile.address = address;
      await userProfileRepository.save(profile);
    }

    const { passwordHash: _, ...rest } = user;
    const { id: __, userId: ___, ...profileData } = profile;
    return { ...rest, ...profileData };
  },
};

export default updateAccountUseCase;
