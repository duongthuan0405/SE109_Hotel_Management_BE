import { bookingRepository, roomRepository, roomTypeRepository, customerRepository } from "../../repository/index.js";
import type { ICustomerUpdateBookingUseCase, UpdateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerUpdateBookingUseCase: ICustomerUpdateBookingUseCase = {
  execute: async (input: UpdateBookingUCInput & { userId: string }): Promise<BookingUCOutput> => {
    const { id, userId, status, details, startDate, endDate, roomClass, roomQuantity } = input;

    const customer = await customerRepository.findByUserId(userId);
    if (!customer) throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };

    const existingBooking = await bookingRepository.findById(id);
    if (!existingBooking) {
      throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
    }

    if (existingBooking.customerId !== customer.id) {
      throw { status: 403, message: "Bạn không có quyền chỉnh sửa đơn đặt phòng này" };
    }

    // 1. Tính toán giá trị mới
    const newStart = startDate ? new Date(startDate) : existingBooking.startDate;
    const newEnd = endDate ? new Date(endDate) : existingBooking.endDate;
    const newRoomClass = roomClass || existingBooking.roomClass;
    const newRoomQuantity = roomQuantity || existingBooking.roomQuantity;
    let newDetails = (details || existingBooking.details);

    const roomType = await roomTypeRepository.findById(newRoomClass);
    if (!roomType) {
      throw { status: 404, message: "Hạng phòng không tồn tại" };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Kiểm tra trùng lịch và tính khả dụng của phòng, đảm bảo khớp số lượng
    if (startDate || endDate || details || roomClass || roomQuantity) {
      // Nếu số lượng thay đổi hoặc không khớp, ta cần điều chỉnh danh sách phòng
      if (newDetails.length !== newRoomQuantity) {
        const allRooms = await roomRepository.findAll();
        const availableRoomsOfClass = allRooms.filter(r => r.roomTypeId === newRoomClass && r.status !== "Maintenance");

        const assignedRoomIds: string[] = [];
        
        // Ưu tiên giữ lại các phòng cũ đang có nếu chúng vẫn hợp lệ
        for (const oldDetail of newDetails) {
           const room = await roomRepository.findById(oldDetail.roomId);
           if (room && room.roomTypeId === newRoomClass && room.status !== "Maintenance") {
              const overlap = await bookingRepository.findOverlappingByRoom(room.id, newStart, newEnd, id);
              if (!overlap) {
                 assignedRoomIds.push(room.id);
                 if (assignedRoomIds.length >= newRoomQuantity) break;
              }
           }
        }

        // Nếu vẫn thiếu phòng, tìm thêm phòng mới
        if (assignedRoomIds.length < newRoomQuantity) {
           for (const room of availableRoomsOfClass) {
              if (assignedRoomIds.includes(room.id)) continue;

              // Nếu ngày nhận phòng là hôm nay, bỏ qua phòng đang có khách hoặc đang dọn dẹp
              if (newStart <= now && ["Occupied", "Cleaning"].includes(room.status)) {
                 continue;
              }

              const overlap = await bookingRepository.findOverlappingByRoom(room.id, newStart, newEnd, id);
              if (!overlap) {
                 assignedRoomIds.push(room.id);
                 if (assignedRoomIds.length >= newRoomQuantity) break;
              }
           }
        }

        if (assignedRoomIds.length < newRoomQuantity) {
           throw { status: 400, message: `Không còn đủ ${newRoomQuantity} phòng trống cho hạng phòng này trong khoảng thời gian mới` };
        }

        newDetails = assignedRoomIds.map(roomId => ({ roomId }));
      } else {
        // Nếu số lượng khớp, chỉ kiểm tra tính hợp lệ của từng phòng
        for (const detail of newDetails) {
          const room = await roomRepository.findById(detail.roomId);
          if (!room || room.roomTypeId !== newRoomClass || room.status === "Maintenance") {
            throw { status: 400, message: `Phòng ${detail.roomId} không khả dụng` };
          }
          const overlap = await bookingRepository.findOverlappingByRoom(detail.roomId, newStart, newEnd, id);
          if (overlap) {
            throw { status: 400, message: `Phòng ${room.code} đã bị trùng lịch` };
          }
        }
      }
    }

    const nights = Math.ceil((newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = roomType.price * nights * newRoomQuantity;

    // 2. Cập nhật thông tin đơn đặt phòng
    const updatedBooking = await bookingRepository.save({
      ...existingBooking,
      ...input,
      roomClass: newRoomClass,
      startDate: newStart,
      endDate: newEnd,
      totalAmount,
      details: newDetails,
      updatedAt: new Date(),
    } as any);

    return (await bookingRepository.findById(updatedBooking.id, { customer: true, rooms: true }))!;

  },
};

export default customerUpdateBookingUseCase;
