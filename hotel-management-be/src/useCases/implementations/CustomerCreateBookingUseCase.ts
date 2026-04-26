import { bookingRepository, roomRepository, roomTypeRepository } from "../../repository/index.js";
import type { ICustomerCreateBookingUseCase, CreateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerCreateBookingUseCase: ICustomerCreateBookingUseCase = {
  execute: async (input: CreateBookingUCInput): Promise<BookingUCOutput> => {
    const { customerId, roomClass, startDate, endDate, guestCount, deposit, details } = input;

    if (!customerId || !roomClass || !startDate || !endDate || !guestCount) {
      throw { status: 400, message: "Vui lòng cung cấp đủ thông tin đặt phòng" };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 1. Kiểm tra tính hợp lệ của ngày tháng
    if (start < now) {
      throw { status: 400, message: "Ngày nhận phòng không thể trong quá khứ" };
    }
    if (start >= end) {
      throw { status: 400, message: "Ngày trả phòng phải sau ngày nhận phòng" };
    }

    // 2. Tìm phòng trống thực tế
    let finalDetails = details || [];
    
    if (finalDetails.length === 0) {
      // Tìm tất cả các phòng thuộc hạng phòng yêu cầu
      const allRooms = await roomRepository.findAll();
      const availableRoomsOfClass = allRooms.filter(r => r.roomTypeId === roomClass && r.status !== "Maintenance");

      let assignedRoomId: string | null = null;

      for (const room of availableRoomsOfClass) {
        // Kiểm tra trạng thái phòng thực tế nếu ngày nhận phòng là hôm nay
        if (start <= now && ["Occupied", "Cleaning"].includes(room.status)) {
          continue;
        }

        // Kiểm tra xem phòng này có bị trùng lịch với bất kỳ đơn đặt phòng nào khác không
        const overlap = await bookingRepository.findOverlappingByRoom(room.id, start, end);
        if (!overlap) {
          assignedRoomId = room.id;
          break;
        }
      }

      if (!assignedRoomId) {
        throw { status: 400, message: `Không còn phòng trống cho hạng phòng ${roomClass} trong khoảng thời gian này` };
      }

      finalDetails = [{
        code: `CTDP-${Date.now()}`,
        roomId: assignedRoomId
      }];
    } else {
      // Nếu khách tự chọn phòng, kiểm tra xem phòng đó có trống không
      for (const detail of finalDetails) {
        const overlap = await bookingRepository.findOverlappingByRoom(detail.roomId, start, end);
        if (overlap) {
          throw { status: 400, message: `Phòng ${detail.roomId} đã bị trùng lịch trong khoảng thời gian này` };
        }
      }
    }

    // 3. Tạo đơn đặt phòng
    const booking = await bookingRepository.create({
      customerId,
      roomClass,
      startDate: start,
      endDate: end,
      guestCount,
      deposit: deposit || 0,
      details: finalDetails,
      status: "Pending",
    });

    return booking;
  },
};

export default customerCreateBookingUseCase;
