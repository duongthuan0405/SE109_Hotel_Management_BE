import { bookingRepository, roomRepository, customerRepository } from "../../repository/index.js";
import { createCustomerUseCase } from "../index.js";
import type { IStaffCreateWalkInBookingUseCase, CreateWalkInBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffCreateWalkInBookingUseCase: IStaffCreateWalkInBookingUseCase = {
  execute: async (input: CreateWalkInBookingUCInput): Promise<BookingUCOutput> => {
    const { 
      customerId: inputCustomerId, 
      fullName, identityCard, phone, email,
      roomClass, startDate, endDate, guestCount, deposit, details 
    } = input;

    let finalCustomerId = inputCustomerId;

    // 1. Tìm hoặc tạo khách hàng nếu chưa có customerId
    if (!finalCustomerId) {
      if (!fullName || !identityCard || !phone) {
        throw { status: 400, message: "Thông tin khách hàng (Họ tên, CMND, SĐT) là bắt buộc cho khách vãng lai" };
      }

      // Thử tìm khách hàng cũ theo CMND hoặc Email
      let customer = await customerRepository.findByIdentityCard(identityCard);
      if (!customer && email) {
        customer = await customerRepository.findByEmail(email);
      }

      if (customer) {
        finalCustomerId = customer.id;
      } else {
        // Tạo khách hàng mới
        const newCustomer = await createCustomerUseCase.execute({
          HoTen: fullName,
          CMND: identityCard,
          SDT: phone,
          Email: email || `walkin_${Date.now()}@hotel.com`,
          DiaChi: "",
        });
        finalCustomerId = newCustomer.id;
      }
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 2. Kiểm tra tính hợp lệ của ngày tháng
    if (start < now) {
      throw { status: 400, message: "Ngày nhận phòng không thể trong quá khứ" };
    }
    if (start >= end) {
      throw { status: 400, message: "Ngày trả phòng phải sau ngày nhận phòng" };
    }

    // 3. Tìm phòng trống thực tế
    let finalDetails = details || [];
    
    if (finalDetails.length === 0) {
      const allRooms = await roomRepository.findAll();
      const availableRoomsOfClass = allRooms.filter(r => r.roomTypeId === roomClass && r.status !== "Maintenance");

      let assignedRoomId: string | null = null;
      for (const room of availableRoomsOfClass) {
        // Kiểm tra trạng thái phòng thực tế nếu ngày nhận phòng là hôm nay
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
        throw { status: 400, message: `Không còn phòng trống cho hạng phòng ${roomClass} trong khoảng thời gian này` };
      }

      finalDetails = [{
        code: `CTDP-WALKIN-${Date.now()}`,
        roomId: assignedRoomId
      }];
    } else {
      for (const detail of finalDetails) {
        const overlap = await bookingRepository.findOverlappingByRoom(detail.roomId, start, end);
        if (overlap) {
          throw { status: 400, message: `Phòng ${detail.roomId} đã bị trùng lịch trong khoảng thời gian này` };
        }
      }
    }

    // 4. Tạo đơn đặt phòng
    const booking = await bookingRepository.create({
      customerId: finalCustomerId!,
      roomClass,
      startDate: start,
      endDate: end,
      guestCount,
      deposit: deposit || 0,
      details: finalDetails,
      status: "Confirmed",
    });

    return booking;
  },
};

export default staffCreateWalkInBookingUseCase;
