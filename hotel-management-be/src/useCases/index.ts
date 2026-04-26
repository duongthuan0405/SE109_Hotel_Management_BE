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

import getAllRoomTypesUseCaseImpl from "./implementations/GetAllRoomTypesUseCase.js";
import getRoomTypeByIdUseCaseImpl from "./implementations/GetRoomTypeByIdUseCase.js";
import createRoomTypeUseCaseImpl from "./implementations/CreateRoomTypeUseCase.js";
import updateRoomTypeUseCaseImpl from "./implementations/UpdateRoomTypeUseCase.js";
import deleteRoomTypeUseCaseImpl from "./implementations/DeleteRoomTypeUseCase.js";

export const getAllRoomTypesUseCase = getAllRoomTypesUseCaseImpl;
export const getRoomTypeByIdUseCase = getRoomTypeByIdUseCaseImpl;
export const createRoomTypeUseCase = createRoomTypeUseCaseImpl;
export const updateRoomTypeUseCase = updateRoomTypeUseCaseImpl;
export const deleteRoomTypeUseCase = deleteRoomTypeUseCaseImpl;

import staffGetAllBookingsUseCaseImpl from "./implementations/StaffGetAllBookingsUseCase.js";
import staffGetBookingByIdUseCaseImpl from "./implementations/StaffGetBookingByIdUseCase.js";
import staffCreateBookingUseCaseImpl from "./implementations/StaffCreateBookingUseCase.js";
import staffCreateWalkInBookingUseCaseImpl from "./implementations/StaffCreateWalkInBookingUseCase.js";
import staffUpdateBookingUseCaseImpl from "./implementations/StaffUpdateBookingUseCase.js";
import staffCancelBookingUseCaseImpl from "./implementations/StaffCancelBookingUseCase.js";
import staffDeleteBookingUseCaseImpl from "./implementations/StaffDeleteBookingUseCase.js";

import customerGetMyBookingsUseCaseImpl from "./implementations/CustomerGetMyBookingsUseCase.js";
import customerGetBookingByIdUseCaseImpl from "./implementations/CustomerGetBookingByIdUseCase.js";
import customerCreateBookingUseCaseImpl from "./implementations/CustomerCreateBookingUseCase.js";
import customerUpdateBookingUseCaseImpl from "./implementations/CustomerUpdateBookingUseCase.js";
import customerCancelBookingUseCaseImpl from "./implementations/CustomerCancelBookingUseCase.js";
import customerDeleteBookingUseCaseImpl from "./implementations/CustomerDeleteBookingUseCase.js";

import getAllServicesUseCaseImpl from "./implementations/GetAllServicesUseCase.js";
import getServiceByIdUseCaseImpl from "./implementations/GetServiceByIdUseCase.js";
import createServiceUseCaseImpl from "./implementations/CreateServiceUseCase.js";
import updateServiceUseCaseImpl from "./implementations/UpdateServiceUseCase.js";
import deleteServiceUseCaseImpl from "./implementations/DeleteServiceUseCase.js";

export const staffGetAllBookingsUseCase = staffGetAllBookingsUseCaseImpl;
export const staffGetBookingByIdUseCase = staffGetBookingByIdUseCaseImpl;
export const staffCreateBookingUseCase = staffCreateBookingUseCaseImpl;
export const staffCreateWalkInBookingUseCase = staffCreateWalkInBookingUseCaseImpl;
export const staffUpdateBookingUseCase = staffUpdateBookingUseCaseImpl;
export const staffCancelBookingUseCase = staffCancelBookingUseCaseImpl;
export const staffDeleteBookingUseCase = staffDeleteBookingUseCaseImpl;

export const customerGetMyBookingsUseCase = customerGetMyBookingsUseCaseImpl;
export const customerGetBookingByIdUseCase = customerGetBookingByIdUseCaseImpl;
export const customerCreateBookingUseCase = customerCreateBookingUseCaseImpl;
export const customerUpdateBookingUseCase = customerUpdateBookingUseCaseImpl;
export const customerCancelBookingUseCase = customerCancelBookingUseCaseImpl;
export const customerDeleteBookingUseCase = customerDeleteBookingUseCaseImpl;

export const getAllServicesUseCase = getAllServicesUseCaseImpl;
export const getServiceByIdUseCase = getServiceByIdUseCaseImpl;
export const createServiceUseCase = createServiceUseCaseImpl;
export const updateServiceUseCase = updateServiceUseCaseImpl;
export const deleteServiceUseCase = deleteServiceUseCaseImpl;

import getAllRoomsUseCaseImpl from "./implementations/GetAllRoomsUseCase.js";
import getRoomByIdUseCaseImpl from "./implementations/GetRoomByIdUseCase.js";
import createRoomUseCaseImpl from "./implementations/CreateRoomUseCase.js";
import updateRoomUseCaseImpl from "./implementations/UpdateRoomUseCase.js";
import deleteRoomUseCaseImpl from "./implementations/DeleteRoomUseCase.js";
import updateRoomStatusUseCaseImpl from "./implementations/UpdateRoomStatusUseCase.js";

export const getAllRoomsUseCase = getAllRoomsUseCaseImpl;
export const getRoomByIdUseCase = getRoomByIdUseCaseImpl;
export const createRoomUseCase = createRoomUseCaseImpl;
export const updateRoomUseCase = updateRoomUseCaseImpl;
export const deleteRoomUseCase = deleteRoomUseCaseImpl;
export const updateRoomStatusUseCase = updateRoomStatusUseCaseImpl;

import getAllCustomersUseCaseImpl from "./implementations/GetAllCustomersUseCase.js";
import getCustomerByIdUseCaseImpl from "./implementations/GetCustomerByIdUseCase.js";
import getCustomerByUserIdUseCaseImpl from "./implementations/GetCustomerByUserIdUseCase.js";
import createCustomerUseCaseImpl from "./implementations/CreateCustomerUseCase.js";
import updateCustomerUseCaseImpl from "./implementations/UpdateCustomerUseCase.js";
import deleteCustomerUseCaseImpl from "./implementations/DeleteCustomerUseCase.js";

export const getAllCustomersUseCase = getAllCustomersUseCaseImpl;
export const getCustomerByIdUseCase = getCustomerByIdUseCaseImpl;
export const getCustomerByUserIdUseCase = getCustomerByUserIdUseCaseImpl;
export const createCustomerUseCase = createCustomerUseCaseImpl;
export const updateCustomerUseCase = updateCustomerUseCaseImpl;
export const deleteCustomerUseCase = deleteCustomerUseCaseImpl;

import getAllStaffsUseCaseImpl from "./implementations/GetAllStaffsUseCase.js";
import getStaffByIdUseCaseImpl from "./implementations/GetStaffByIdUseCase.js";
import getStaffByUserIdUseCaseImpl from "./implementations/GetStaffByUserIdUseCase.js";
import createStaffUseCaseImpl from "./implementations/CreateStaffUseCase.js";
import updateStaffUseCaseImpl from "./implementations/UpdateStaffUseCase.js";
import deleteStaffUseCaseImpl from "./implementations/DeleteStaffUseCase.js";

export const getAllStaffsUseCase = getAllStaffsUseCaseImpl;
export const getStaffByIdUseCase = getStaffByIdUseCaseImpl;
export const getStaffByUserIdUseCase = getStaffByUserIdUseCaseImpl;
export const createStaffUseCase = createStaffUseCaseImpl;
export const updateStaffUseCase = updateStaffUseCaseImpl;
export const deleteStaffUseCase = deleteStaffUseCaseImpl;
