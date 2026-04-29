import { bookingRepository, roomRepository, roomTypeRepository, customerRepository } from "../../repository/index.js";
import type { ICustomerCreateBookingUseCase, CreateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerCreateBookingUseCase: ICustomerCreateBookingUseCase = {
  execute: async (input: CreateBookingUCInput): Promise<BookingUCOutput> => {
    let { customerId, userId, roomClass, startDate, endDate, guestCount, deposit, details } = input;

    // TÌM KIẾM: Nếu có userId mà chưa có customerId (luồng Khách hàng tự đặt)
    if (userId && !customerId) {
      const customer = await customerRepository.findByUserId(userId);
      if (!customer) throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };
      customerId = customer.id;
    }

    if (!customerId || !roomClass || !startDate || !endDate || !guestCount) {
      throw { status: 400, message: "Vui lòng cung cấp đủ thông tin đặt phòng" };
    }

    // 0. Kiểm tra hạng phòng tồn tại và sức chứa
    const roomType = await roomTypeRepository.findById(roomClass);
    if (!roomType) {
      throw { status: 404, message: "Hạng phòng không tồn tại" };
    }
    if (guestCount > roomType.maxOccupancy) {
      throw { status: 400, message: `Số khách vượt quá sức chứa tối đa của hạng phòng (${roomType.maxOccupancy} người)` };
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
      const allRooms = await roomRepository.findAll();
      const availableRoomsOfClass = allRooms.filter(r => r.roomTypeId === roomClass && r.status !== "Maintenance");

      let assignedRoomId: string | null = null;
      for (const room of availableRoomsOfClass) {
        if (start <= now && ["Occupied", "Cleaning"].includes(room.status)) {
          continue;
        }

        const overlap = await bookingRepository.findOverlappingByRoom(room.id, start, end);
        if (!overlap) {
          assignedRoomId = room.id;
          break;
        }
      }

      if (!assignedRoomId) {
        throw { status: 400, message: `Không còn phòng trống cho hạng phòng ${roomType.name} trong khoảng thời gian này` };
      }

      finalDetails = [{
        roomId: assignedRoomId
      }];
    } else {
      // Đảm bảo mỗi chi tiết đều có mã định danh (Backend sinh)
      finalDetails = finalDetails.map((d, index) => ({
        ...d,
      }));

      for (const detail of finalDetails) {
        const room = await roomRepository.findById(detail.roomId);
        if (!room || room.roomTypeId !== roomClass || room.status === "Maintenance") {
          throw { status: 400, message: `Phòng ${room?.code || detail.roomId} không khả dụng` };
        }
        
        if (room.status !== "Available") {
          const overlap = await bookingRepository.findOverlappingByRoom(detail.roomId, start, end);
          if (overlap) {
            throw { status: 400, message: `Phòng ${room.code} đã bị trùng lịch trong khoảng thời gian này` };
          }
        }
      }
    }

    // 3. Tính toán tổng tiền
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = roomType.price * nights;

    if (deposit && deposit > totalAmount) {
      throw { status: 400, message: "Tiền cọc không thể lớn hơn tổng tiền phòng" };
    }

    // 5. Tạo đơn đặt phòng
    const booking = await bookingRepository.create({
      customerId,
      roomClass,
      startDate: start,
      endDate: end,
      guestCount,
      deposit: deposit || 0,
      totalAmount,
      details: finalDetails.map(d => ({ roomId: d.roomId })), // Để Repo tự sinh mã CTDP
      status: "Pending",
    });

    return (await bookingRepository.findById(booking.id, { customer: true, rooms: true }))!;
  },
};

export default customerCreateBookingUseCase;
