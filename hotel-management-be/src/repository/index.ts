import userRepositoryImpl from "./implementations/UserRepository.js";
import userProfileRepositoryImpl from "./implementations/UserProfileRepository.js";
import resetPasswordOTPRepositoryImpl from "./implementations/ResetPasswordOTPRepository.js";
import roomTypeRepositoryImpl from "./implementations/RoomTypeRepository.js";
import bookingRepositoryImpl from "./implementations/BookingRepository.js";
import serviceRepositoryImpl from "./implementations/ServiceRepository.js";

export const userRepository = userRepositoryImpl;
export const userProfileRepository = userProfileRepositoryImpl;
export const resetPasswordOTPRepository = resetPasswordOTPRepositoryImpl;
export const roomTypeRepository = roomTypeRepositoryImpl;
export const bookingRepository = bookingRepositoryImpl;
export const serviceRepository = serviceRepositoryImpl;
