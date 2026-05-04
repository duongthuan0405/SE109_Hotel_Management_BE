import env from "../config/env.js";

// --- Import Mock Implementations (cho môi trường test) ---
import userRepositoryMock from "./implementations/test/UserRepository.js";
import resetPasswordOTPRepositoryMock from "./implementations/test/ResetPasswordOTPRepository.js";
import roomTypeRepositoryMock from "./implementations/test/RoomTypeRepository.js";
import bookingRepositoryMock from "./implementations/test/BookingRepository.js";
import serviceRepositoryMock from "./implementations/test/ServiceRepository.js";
import roomRepositoryMock from "./implementations/test/RoomRepository.js";
import customerRepositoryMock from "./implementations/test/CustomerRepository.js";
import staffRepositoryMock from "./implementations/test/StaffRepository.js";
import rentalReceiptRepositoryMock from "./implementations/test/RentalReceiptRepository.js";
import serviceUsageRepositoryMock from "./implementations/test/ServiceUsageRepository.js";
import settingsRepositoryMock from "./implementations/test/SettingsRepository.js";
import paymentMethodRepositoryMock from "./implementations/test/PaymentMethodRepository.js";
import invoiceRepositoryMock from "./implementations/test/InvoiceRepository.js";
import bookingHistoryRepositoryMock from "./implementations/test/BookingHistoryRepository.js";
import positionRepositoryImpl from "./implementations/test/PositionRepository.js";
import serviceUsageHistoryRepositoryImpl from "./implementations/test/ServiceUsageHistoryRepository.js";
import maintenanceRepositoryImpl from "./implementations/test/MaintenanceRepository.js";
import notificationRepositoryImpl from "./implementations/test/NotificationRepository.js";

// --- Import Prisma Implementations (cho môi trường dev/prod) ---
import userRepositoryPrisma from "./implementations/psql/UserPrismaRepository.js";
import resetPasswordOTPRepositoryPrisma from "./implementations/psql/ResetPasswordOTPPrismaRepository.js";
import roomTypeRepositoryPrisma from "./implementations/psql/RoomTypePrismaRepository.js";
import bookingRepositoryPrisma from "./implementations/psql/BookingPrismaRepository.js";
import serviceRepositoryPrisma from "./implementations/psql/ServicePrismaRepository.js";
import roomRepositoryPrisma from "./implementations/psql/RoomPrismaRepository.js";
import customerRepositoryPrisma from "./implementations/psql/CustomerPrismaRepository.js";
import staffRepositoryPrisma from "./implementations/psql/StaffPrismaRepository.js";
import rentalReceiptRepositoryPrisma from "./implementations/psql/RentalReceiptPrismaRepository.js";
import serviceUsageRepositoryPrisma from "./implementations/psql/ServiceUsagePrismaRepository.js";
import settingsRepositoryPrisma from "./implementations/psql/SettingsPrismaRepository.js";
import paymentMethodRepositoryPrisma from "./implementations/psql/PaymentMethodPrismaRepository.js";
import invoiceRepositoryPrisma from "./implementations/psql/InvoicePrismaRepository.js";
import bookingHistoryRepositoryPrisma from "./implementations/psql/BookingHistoryPrismaRepository.js";



// --- Import UnitOfWork ---
import unitOfWorkPrisma from "./implementations/psql/PrismaUnitOfWork.js";
import unitOfWorkMock from "./implementations/test/MockUnitOfWork.js";

// Quyết định sử dụng bộ repository nào dựa trên NODE_ENV
const isTest = env.NODE_ENV === "test";

// Export UnitOfWork tương ứng với môi trường
export const unitOfWork = isTest ? unitOfWorkMock : unitOfWorkPrisma;

export const userRepository = isTest ? userRepositoryMock : userRepositoryPrisma;

export const resetPasswordOTPRepository = isTest ? resetPasswordOTPRepositoryMock : resetPasswordOTPRepositoryPrisma;
export const roomTypeRepository = isTest ? roomTypeRepositoryMock : roomTypeRepositoryPrisma;
export const bookingRepository = isTest ? bookingRepositoryMock : bookingRepositoryPrisma;
export const serviceRepository = isTest ? serviceRepositoryMock : serviceRepositoryPrisma;
export const roomRepository = isTest ? roomRepositoryMock : roomRepositoryPrisma;
export const customerRepository = isTest ? customerMockRepository(isTest) : customerRepositoryPrisma;
export const staffRepository = isTest ? staffRepositoryMock : staffRepositoryPrisma;
export const rentalReceiptRepository = isTest ? rentalReceiptRepositoryMock : rentalReceiptRepositoryPrisma;
export const serviceUsageRepository = isTest ? serviceUsageRepositoryMock : serviceUsageRepositoryPrisma;
export const settingsRepository = isTest ? settingsRepositoryMock : settingsRepositoryPrisma;
export const paymentMethodRepository = isTest ? paymentMethodRepositoryMock : paymentMethodRepositoryPrisma;
export const invoiceRepository = isTest ? invoiceRepositoryMock : invoiceRepositoryPrisma;
export const bookingHistoryRepository = isTest ? bookingHistoryRepositoryMock : bookingHistoryRepositoryPrisma;
export const maintenanceRepository = maintenanceRepositoryImpl;
export const notificationRepository = notificationRepositoryImpl;
export const positionRepository = positionRepositoryImpl;
export const serviceUsageHistoryRepository = serviceUsageHistoryRepositoryImpl;

// Helper vì customerRepository cần xử lý đặc biệt một chút nếu có logic liên đới
function customerMockRepository(isTest: boolean) {
  return customerRepositoryMock;
}
