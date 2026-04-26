import { bookingRepository, roomRepository, roomTypeRepository } from "../../repository/index.js";
import type { IStaffUpdateBookingUseCase, UpdateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffUpdateBookingUseCase: IStaffUpdateBookingUseCase = {
  execute: async (input: UpdateBookingUCInput): Promise<BookingUCOutput> => {
    const { id, status, details, startDate, endDate, roomClass, guestCount } = input;

    const existingBooking = await bookingRepository.findById(id);
    if (!existingBooking) {
      throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
    }

    // 1. Kiểm tra tính hợp lệ của thay đổi
    const newStart = startDate ? new Date(startDate) : existingBooking.startDate;
    const newEnd = endDate ? new Date(endDate) : existingBooking.endDate;
    const newRoomClass = roomClass || existingBooking.roomClass;
    const newGuestCount = guestCount || existingBooking.guestCount;
    let newDetails = details || existingBooking.details;

    const roomType = await roomTypeRepository.findById(newRoomClass);
    if (!roomType) {
      throw { status: 404, message: "Hạng phòng không tồn tại" };
    }
    if (newGuestCount > roomType.maxOccupancy) {
      throw { status: 400, message: `Số khách vượt quá sức chứa tối đa (${roomType.maxOccupancy})` };
    }

    // Logic tự động gán phòng nếu chuyển sang CheckedIn mà chưa có phòng
    if (status === "CheckedIn" && (!newDetails || newDetails.length === 0)) {
      const allRooms = await roomRepository.findAll();
      const availableRoomsOfClass = allRooms.filter(r => r.roomTypeId === newRoomClass && r.status !== "Maintenance");

      let assignedRoomId: string | null = null;
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      for (const room of availableRoomsOfClass) {
        if (newStart <= now && ["Occupied", "Cleaning"].includes(room.status)) {
          continue;
        }
        const overlap = await bookingRepository.findOverlappingByRoom(room.id, newStart, newEnd, id);
        if (!overlap) {
          assignedRoomId = room.id;
          break;
        }
      }

      if (assignedRoomId) {
        newDetails = [{
          code: `CTDP-AUTO-${Date.now()}`,
          roomId: assignedRoomId
        }];
      } else {
        throw { status: 400, message: "Không thể tự động gán phòng vì không còn phòng trống" };
      }
    }

    // Kiểm tra trùng lịch và tính khả dụng của phòng
    if (startDate || endDate || details || roomClass) {
      for (const detail of newDetails) {
        const room = await roomRepository.findById(detail.roomId);
        if (!room || room.roomTypeId !== newRoomClass || room.status === "Maintenance") {
          throw { status: 400, message: `Phòng ${detail.roomId} không khả dụng cho hạng phòng này` };
        }
        const overlap = await bookingRepository.findOverlappingByRoom(detail.roomId, newStart, newEnd, id);
        if (overlap) {
          throw { status: 400, message: `Phòng ${room.roomNumber} đã bị trùng lịch trong khoảng thời gian mới` };
        }
      }
    }

    // Recalculate totalAmount if needed
    const nights = Math.ceil((newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = roomType.price * nights;


    // 2. Cập nhật thông tin đơn đặt phòng
    const updatedBooking = await bookingRepository.save({
      ...existingBooking,
      ...input,
      roomClass: newRoomClass,
      startDate: newStart,
      endDate: newEnd,
      guestCount: newGuestCount,
      totalAmount,
      details: newDetails,
      updatedAt: new Date(),
    } as any);

    // 3. Cập nhật trạng thái phòng (Giải phóng phòng cũ nếu có thay đổi)
    if (details) {
      for (const oldDetail of existingBooking.details) {
        // Nếu phòng cũ không nằm trong danh sách mới, giải phóng nó
        if (!newDetails.some(d => d.roomId === oldDetail.roomId)) {
          await roomRepository.updateStatus(oldDetail.roomId, "Available");
        }
      }
    }

    // Cập nhật trạng thái phòng dựa trên trạng thái đơn hàng mới
    if (status === "CheckedIn") {
      for (const detail of updatedBooking.details) {
        await roomRepository.updateStatus(detail.roomId, "Occupied");
      }
    } else if (status === "CheckedOut") {
      for (const detail of updatedBooking.details) {
        await roomRepository.updateStatus(detail.roomId, "Cleaning");
      }
    } else if (status === "Cancelled") {
      for (const detail of updatedBooking.details) {
        await roomRepository.updateStatus(detail.roomId, "Available");
      }
    } else if (existingBooking.status === "CheckedIn" && (status === "Confirmed" || !status)) {
      // Nếu lùi trạng thái hoặc giữ nguyên trạng thái nhưng đổi ngày sang tương lai
      const now = new Date();
      now.setHours(0,0,0,0);
      if (newStart > now) {
        for (const detail of updatedBooking.details) {
          await roomRepository.updateStatus(detail.roomId, "Available");
        }
      }
    }

    return updatedBooking;
  },
};

export default staffUpdateBookingUseCase;
