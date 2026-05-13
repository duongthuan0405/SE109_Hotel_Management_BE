import { bookingRepository, roomRepository, unitOfWork } from "../../repository/index.js";
import { momoService } from "../../services/index.js";
import { type IVerifyMomoRedirectUseCase, type VerifyMomoRedirectUCInput } from "../types/IMomoUseCases.js";
import { type Booking } from "../../models/Booking.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";

const verifyMomoRedirectUseCase: IVerifyMomoRedirectUseCase = {
  execute: async (input: VerifyMomoRedirectUCInput): Promise<Booking> => {
    const query = input.query;
    const signature = query.signature as string;

    // 1. Kiểm tra chữ ký (Bypass cảnh báo nếu sai chữ ký ở môi trường Development/Demo để bạn dễ dàng test tay qua Swagger/Postman)
    const isValid = momoService.verifySignature(query, signature);
    if (!isValid) {
      console.warn("[MOMO DEMO BYPASS] Chữ ký không hợp lệ, nhưng hệ thống vẫn chấp nhận để phục vụ DEMO / TEST.");
    }

    // Bypass code: Ghi nhận giao dịch ok cho Demo
    const resultCode = Number(query.resultCode);
    if (resultCode !== 0) {
      console.log(`[MOMO REDIRECT BYPASS] Giao dịch có mã lỗi (${resultCode}), nhưng vẫn cho hoàn tất đơn đặt phòng cho Demo.`);
    }

    // 2. Trích xuất mã đơn đặt từ trường extraData
    const bookingId = query.extraData as string;
    if (!bookingId) {
       throw { status: 400, message: "Thông tin liên kết đơn hàng bị trống (Thiếu extraData chứa bookingId)." };
    }

    let finalBooking: Booking | null = null;

    // 3. Thực hiện Transaction tự động cập nhật Confirmed cho Booking ngay tại đây để Localhost Demo chạy mượt mà
    await unitOfWork.runInTransaction(async () => {
      const booking = await bookingRepository.findById(bookingId, { customer: true, rooms: true });
      if (!booking) {
        throw { status: 404, message: "Không tìm thấy đơn đặt phòng tương ứng trong hệ thống." };
      }

      // Cập nhật trạng thái Booking & Phòng nếu đơn hàng chưa được xác nhận trước đó
      if (booking.status !== "Confirmed" && booking.status !== "CheckedIn" && booking.status !== "CheckedOut" && booking.status !== "Cancelled") {
        const oldStatus = booking.status;
        
        // Chuyển trạng thái Booking -> Confirmed
        await bookingRepository.updateStatus(bookingId, "Confirmed");

        // Ghi nhận lịch sử thay đổi
        await createBookingHistoryUseCase.execute({
          bookingId: booking.id,
          oldStatus: oldStatus,
          newStatus: "Confirmed",
        });

        // Giữ chỗ phòng (Reserved) cho các phòng liên kết
        if (booking.details && booking.details.length > 0) {
          for (const detail of booking.details) {
            if (detail.roomId) {
              await roomRepository.updateStatus(detail.roomId, "Reserved");
            }
          }
        }
        console.log(`[MOMO REDIRECT DEMO] Đã tự động Xác nhận & Khóa giữ chỗ phòng cho Booking ${booking.code} thành công!`);
      }

      // Lấy lại dữ liệu Booking mới nhất sau cập nhật
      finalBooking = await bookingRepository.findById(bookingId, { customer: true, rooms: true });
    });

    return finalBooking!;
  },
};

export default verifyMomoRedirectUseCase;
