import { bookingRepository } from "../../repository/index.js";
import { momoService } from "../../services/index.js";
import { type IVerifyMomoRedirectUseCase, type VerifyMomoRedirectUCInput } from "../types/IMomoUseCases.js";
import { type Booking } from "../../models/Booking.js";

const verifyMomoRedirectUseCase: IVerifyMomoRedirectUseCase = {
  execute: async (input: VerifyMomoRedirectUCInput): Promise<Booking> => {
    const query = input.query;
    const signature = query.signature as string;

    // Validating query string parameters from return back navigation
    const isValid = momoService.verifySignature(query, signature);
    if (!isValid) {
      throw { status: 400, message: "Chữ ký xác thực từ đối tác không hợp lệ (Fraud attempt)." };
    }

    const resultCode = Number(query.resultCode);
    if (resultCode !== 0) {
      throw { status: 400, message: `Giao dịch bị gián đoạn hoặc từ chối. (Mã lỗi MoMo: ${resultCode})` };
    }

    // Safe Extraction
    const bookingId = query.extraData as string;
    if (!bookingId) {
       throw { status: 400, message: "Thông tin liên kết đơn hàng bị trống." };
    }

    const booking = await bookingRepository.findById(bookingId, { customer: true, rooms: true });
    if (!booking) {
      throw { status: 404, message: "Không tìm thấy đơn đặt phòng tương ứng trong hệ thống." };
    }

    // Return final booking status
    return booking;
  },
};

export default verifyMomoRedirectUseCase;
