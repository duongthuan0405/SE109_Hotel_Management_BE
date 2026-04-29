import { bookingRepository, roomRepository, roomTypeRepository, customerRepository } from "../../repository/index.js";
import type { ICustomerUpdateBookingUseCase, UpdateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerUpdateBookingUseCase: ICustomerUpdateBookingUseCase = {
  execute: async (input: UpdateBookingUCInput & { userId: string }): Promise<BookingUCOutput> => {
    const { id, userId, status, details, startDate, endDate, roomClass, guestCount } = input;

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
    const newGuestCount = guestCount || existingBooking.guestCount;
    let newDetails = (details || existingBooking.details).map((d, index) => ({
      ...d,
      code: d.code || `CTDP-${Date.now()}-${index}`
    }));

    const roomType = await roomTypeRepository.findById(newRoomClass);
    if (!roomType) {
      throw { status: 404, message: "Hạng phòng không tồn tại" };
    }
    if (newGuestCount > roomType.maxOccupancy) {
      throw { status: 400, message: `Số khách vượt quá sức chứa tối đa (${roomType.maxOccupancy})` };
    }

    if (startDate || endDate || details || roomClass) {
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

    return (await bookingRepository.findById(updatedBooking.id, { customer: true, rooms: true }))!;
  },
};

export default customerUpdateBookingUseCase;
