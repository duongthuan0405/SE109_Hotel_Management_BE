import loginUseCaseImpl from "./implementations/LoginUseCase.js";
import registerUseCaseImpl from "./implementations/RegisterUseCase.js";
import forgotPasswordUseCaseImpl from "./implementations/ForgotPasswordUseCase.js";
import resetPasswordUseCaseImpl from "./implementations/ResetPasswordUseCase.js";

import getAllAccountsUseCaseImpl from "./implementations/GetAllAccountsUseCase.js";
import getAccountByIdUseCaseImpl from "./implementations/GetAccountByIdUseCase.js";
import createAccountUseCaseImpl from "./implementations/CreateAccountUseCase.js";
import updateAccountUseCaseImpl from "./implementations/UpdateAccountUseCase.js";
import changePasswordUseCaseImpl from "./implementations/ChangePasswordUseCase.js";
import deleteAccountUseCaseImpl from "./implementations/DeleteAccountUseCase.js";

export const loginUseCase = loginUseCaseImpl;
export const registerUseCase = registerUseCaseImpl;
export const forgotPasswordUseCase = forgotPasswordUseCaseImpl;
export const resetPasswordUseCase = resetPasswordUseCaseImpl;

export const getAllAccountsUseCase = getAllAccountsUseCaseImpl;
export const getAccountByIdUseCase = getAccountByIdUseCaseImpl;
export const createAccountUseCase = createAccountUseCaseImpl;
export const updateAccountUseCase = updateAccountUseCaseImpl;
export const changePasswordUseCase = changePasswordUseCaseImpl;
export const deleteAccountUseCase = deleteAccountUseCaseImpl;

import {
  getAllRoomTypesUseCase as getAllRoomTypesUseCaseImpl,
  getRoomTypeByIdUseCase as getRoomTypeByIdUseCaseImpl,
  createRoomTypeUseCase as createRoomTypeUseCaseImpl,
  updateRoomTypeUseCase as updateRoomTypeUseCaseImpl,
  deleteRoomTypeUseCase as deleteRoomTypeUseCaseImpl,
} from "./implementations/RoomTypeUseCases.js";

export const getAllRoomTypesUseCase = getAllRoomTypesUseCaseImpl;
export const getRoomTypeByIdUseCase = getRoomTypeByIdUseCaseImpl;
export const createRoomTypeUseCase = createRoomTypeUseCaseImpl;
export const updateRoomTypeUseCase = updateRoomTypeUseCaseImpl;
export const deleteRoomTypeUseCase = deleteRoomTypeUseCaseImpl;
