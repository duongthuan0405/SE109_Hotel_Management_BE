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

import { createRentalReceipt as createRentalReceiptUseCaseImpl } from "./implementations/CreateRentalReceiptUseCase.js";
import { getAllRentalReceipts as getAllRentalReceiptsUseCaseImpl } from "./implementations/GetAllRentalReceiptsUseCase.js";
import { getRentalReceiptById as getRentalReceiptByIdUseCaseImpl } from "./implementations/GetRentalReceiptByIdUseCase.js";
import { updateRentalReceipt as updateRentalReceiptUseCaseImpl } from "./implementations/UpdateRentalReceiptUseCase.js";
import { checkOut as checkOutUseCaseImpl } from "./implementations/CheckOutUseCase.js";
import { deleteRentalReceipt as deleteRentalReceiptUseCaseImpl } from "./implementations/DeleteRentalReceiptUseCase.js";

export const createRentalReceiptUseCase = createRentalReceiptUseCaseImpl;
export const getAllRentalReceiptsUseCase = getAllRentalReceiptsUseCaseImpl;
export const getRentalReceiptByIdUseCase = getRentalReceiptByIdUseCaseImpl;
export const updateRentalReceiptUseCase = updateRentalReceiptUseCaseImpl;
export const checkOutUseCase = checkOutUseCaseImpl;
export const deleteRentalReceiptUseCase = deleteRentalReceiptUseCaseImpl;

import { createServiceUsage as createServiceUsageUseCaseImpl } from "./implementations/CreateServiceUsageUseCase.js";
import { getAllServiceUsages as getAllServiceUsagesUseCaseImpl } from "./implementations/GetAllServiceUsagesUseCase.js";
import { getServiceUsageById as getServiceUsageByIdUseCaseImpl } from "./implementations/GetServiceUsageByIdUseCase.js";
import { getServiceUsagesByCustomerId as getServiceUsagesByCustomerIdUseCaseImpl } from "./implementations/GetServiceUsagesByCustomerIdUseCase.js";
import { customerGetMyServiceUsages as customerGetMyServiceUsagesUseCaseImpl } from "./implementations/CustomerGetMyServiceUsagesUseCase.js";
import { customerOrderService as customerOrderServiceUseCaseImpl } from "./implementations/CustomerOrderServiceUseCase.js";
import { updateServiceUsage as updateServiceUsageUseCaseImpl } from "./implementations/UpdateServiceUsageUseCase.js";
import { deleteServiceUsage as deleteServiceUsageUseCaseImpl } from "./implementations/DeleteServiceUsageUseCase.js";

export const createServiceUsageUseCase = createServiceUsageUseCaseImpl;
export const getAllServiceUsagesUseCase = getAllServiceUsagesUseCaseImpl;
export const getServiceUsageByIdUseCase = getServiceUsageByIdUseCaseImpl;
export const getServiceUsagesByCustomerIdUseCase = getServiceUsagesByCustomerIdUseCaseImpl;
export const customerGetMyServiceUsagesUseCase = customerGetMyServiceUsagesUseCaseImpl;
export const customerOrderServiceUseCase = customerOrderServiceUseCaseImpl;
export const updateServiceUsageUseCase = updateServiceUsageUseCaseImpl;
export const deleteServiceUsageUseCase = deleteServiceUsageUseCaseImpl;

import { getSettings as getSettingsUseCaseImpl } from "./implementations/GetSettingsUseCase.js";
import { updateSettings as updateSettingsUseCaseImpl } from "./implementations/UpdateSettingsUseCase.js";

export const getSettingsUseCase = getSettingsUseCaseImpl;
export const updateSettingsUseCase = updateSettingsUseCaseImpl;

import { createPaymentMethod as createPaymentMethodUseCaseImpl } from "./implementations/CreatePaymentMethodUseCase.js";
import { getAllPaymentMethods as getAllPaymentMethodsUseCaseImpl } from "./implementations/GetAllPaymentMethodsUseCase.js";
import { getPaymentMethodById as getPaymentMethodByIdUseCaseImpl } from "./implementations/GetPaymentMethodByIdUseCase.js";
import { updatePaymentMethod as updatePaymentMethodUseCaseImpl } from "./implementations/UpdatePaymentMethodUseCase.js";
import { deletePaymentMethod as deletePaymentMethodUseCaseImpl } from "./implementations/DeletePaymentMethodUseCase.js";

export const createPaymentMethodUseCase = createPaymentMethodUseCaseImpl;
export const getAllPaymentMethodsUseCase = getAllPaymentMethodsUseCaseImpl;
export const getPaymentMethodByIdUseCase = getPaymentMethodByIdUseCaseImpl;
export const updatePaymentMethodUseCase = updatePaymentMethodUseCaseImpl;
export const deletePaymentMethodUseCase = deletePaymentMethodUseCaseImpl;

import { createInvoice as createInvoiceUseCaseImpl } from "./implementations/CreateInvoiceUseCase.js";
import { createCheckoutInvoice as createCheckoutInvoiceUseCaseImpl } from "./implementations/CreateCheckoutInvoiceUseCase.js";
import { getPreviewInvoice as getPreviewInvoiceUseCaseImpl } from "./implementations/GetPreviewInvoiceUseCase.js";
import { getAllInvoices as getAllInvoicesUseCaseImpl } from "./implementations/GetAllInvoicesUseCase.js";
import { getInvoiceById as getInvoiceByIdUseCaseImpl } from "./implementations/GetInvoiceByIdUseCase.js";
import { updateInvoice as updateInvoiceUseCaseImpl } from "./implementations/UpdateInvoiceUseCase.js";
import { deleteInvoice as deleteInvoiceUseCaseImpl } from "./implementations/DeleteInvoiceUseCase.js";

import { createBookingHistory as createBookingHistoryUseCaseImpl } from "./implementations/CreateBookingHistoryUseCase.js";
import { getAllBookingHistory as getAllBookingHistoryUseCaseImpl } from "./implementations/GetAllBookingHistoryUseCase.js";
import { getBookingHistoryById as getBookingHistoryByIdUseCaseImpl } from "./implementations/GetBookingHistoryByIdUseCase.js";
import { getHistoryByBookingId as getHistoryByBookingIdUseCaseImpl } from "./implementations/GetHistoryByBookingIdUseCase.js";
import { deleteBookingHistory as deleteBookingHistoryUseCaseImpl } from "./implementations/DeleteBookingHistoryUseCase.js";

export const createInvoiceUseCase = createInvoiceUseCaseImpl;
export const createCheckoutInvoiceUseCase = createCheckoutInvoiceUseCaseImpl;
export const getPreviewInvoiceUseCase = getPreviewInvoiceUseCaseImpl;
export const getAllInvoicesUseCase = getAllInvoicesUseCaseImpl;
export const getInvoiceByIdUseCase = getInvoiceByIdUseCaseImpl;
export const updateInvoiceUseCase = updateInvoiceUseCaseImpl;
export const deleteInvoiceUseCase = deleteInvoiceUseCaseImpl;

export const createBookingHistoryUseCase = createBookingHistoryUseCaseImpl;
export const getAllBookingHistoryUseCase = getAllBookingHistoryUseCaseImpl;
export const getBookingHistoryByIdUseCase = getBookingHistoryByIdUseCaseImpl;
export const getHistoryByBookingIdUseCase = getHistoryByBookingIdUseCaseImpl;
export const deleteBookingHistoryUseCase = deleteBookingHistoryUseCaseImpl;

import getAllMaintenanceUseCaseImpl from "./implementations/Maintenance/GetAllMaintenanceUseCase.js";
import getMaintenanceByIdUseCaseImpl from "./implementations/Maintenance/GetMaintenanceByIdUseCase.js";
import getNextMaintenanceCodeUseCaseImpl from "./implementations/Maintenance/GetNextMaintenanceCodeUseCase.js";
import createMaintenanceUseCaseImpl from "./implementations/Maintenance/CreateMaintenanceUseCase.js";
import updateMaintenanceUseCaseImpl from "./implementations/Maintenance/UpdateMaintenanceUseCase.js";
import deleteMaintenanceUseCaseImpl from "./implementations/Maintenance/DeleteMaintenanceUseCase.js";
import guestGetMaintenanceRequestsUseCaseImpl from "./implementations/Maintenance/GuestGetMaintenanceRequestsUseCase.js";
import guestCreateMaintenanceRequestUseCaseImpl from "./implementations/Maintenance/GuestCreateMaintenanceRequestUseCase.js";

export const getAllMaintenanceUseCase = getAllMaintenanceUseCaseImpl;
export const getMaintenanceByIdUseCase = getMaintenanceByIdUseCaseImpl;
export const getNextMaintenanceCodeUseCase = getNextMaintenanceCodeUseCaseImpl;
export const createMaintenanceUseCase = createMaintenanceUseCaseImpl;
export const updateMaintenanceUseCase = updateMaintenanceUseCaseImpl;
export const deleteMaintenanceUseCase = deleteMaintenanceUseCaseImpl;
export const guestGetMaintenanceRequestsUseCase = guestGetMaintenanceRequestsUseCaseImpl;
export const guestCreateMaintenanceRequestUseCase = guestCreateMaintenanceRequestUseCaseImpl;

import getNotificationsUseCaseImpl from "./implementations/Notification/GetNotificationsUseCase.js";
import markNotificationAsReadUseCaseImpl from "./implementations/Notification/MarkNotificationAsReadUseCase.js";
import createNotificationUseCaseImpl from "./implementations/Notification/CreateNotificationUseCase.js";

export const getNotificationsUseCase = getNotificationsUseCaseImpl;
export const markNotificationAsReadUseCase = markNotificationAsReadUseCaseImpl;
export const createNotificationUseCase = createNotificationUseCaseImpl;
