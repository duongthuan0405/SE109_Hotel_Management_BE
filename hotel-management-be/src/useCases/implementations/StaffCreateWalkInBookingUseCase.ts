import { bookingRepository, roomRepository, customerRepository, roomTypeRepository, unitOfWork } from "../../repository/index.js";
import createCustomerUseCase from "./CreateCustomerUseCase.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";
import type { IStaffCreateWalkInBookingUseCase, CreateWalkInBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffCreateWalkInBookingUseCase: IStaffCreateWalkInBookingUseCase = {
  execute: async (input: CreateWalkInBookingUCInput): Promise<BookingUCOutput> => {
    return await unitOfWork.runInTransaction(async () => {
      const { 
        customerId: inputCustomerId, 
        fullName, identityCard, phone, email,
        roomClass, startDate, endDate, roomQuantity, deposit, details,
        executorUserId 
      } = input;
      const quantity = roomQuantity || 1;

      // 0. Kiểm tra hạng phòng tồn tại
      const roomType = await roomTypeRepository.findById(roomClass);
      if (!roomType) {
        throw { status: 404, message: "Hạng phòng không tồn tại" };
      }

      let finalCustomerId = inputCustomerId;

      // 1. Tìm hoặc tạo khách hàng nếu chưa có customerId
      if (!finalCustomerId) {
        if (!fullName || !identityCard || !phone) {
          throw { status: 400, message: "Thông tin khách hàng (Họ tên, CMND, SĐT) là bắt buộc cho khách vãng lai" };
        }

        let customer = await customerRepository.findByIdentityCard(identityCard);
        if (!customer && email) {
          customer = await customerRepository.findByEmail(email);
        }

        if (customer) {
          finalCustomerId = customer.id;
        } else {
          // createCustomerUseCase sẽ tự động tham gia transaction này
          const newCustomer = await createCustomerUseCase.execute({
            fullName,
            identityCard,
            phone,
            email: email || `walkin_${Date.now()}@hotel.com`,
            address: "",
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
      
      // Nếu không cung cấp chi tiết hoặc số lượng không khớp, tự động chọn phòng
      if (finalDetails.length !== quantity) {
        const allRooms = await roomRepository.findAll();
        const availableRoomsOfClass = allRooms.filter(r => r.roomTypeId === roomClass && r.status !== "Maintenance");

        const assignedRoomIds: string[] = [];
        for (const room of availableRoomsOfClass) {
          // Nếu ngày nhận phòng là hôm nay, bỏ qua phòng đang có khách hoặc đang dọn dẹp
          if (start <= now && ["Occupied", "Cleaning"].includes(room.status)) {
            continue;
          }

          const overlap = await bookingRepository.findOverlappingByRoom(room.id, start, end);
          if (!overlap) {
            assignedRoomIds.push(room.id);
            if (assignedRoomIds.length >= quantity) break;
          }
        }

        if (assignedRoomIds.length < quantity) {
          throw { status: 400, message: `Không còn đủ ${quantity} phòng trống cho hạng phòng ${roomType.name} trong khoảng thời gian này` };
        }

        finalDetails = assignedRoomIds.map(roomId => ({ roomId }));
      } else {
        // Nếu cung cấp chi tiết và khớp số lượng, chỉ kiểm tra tính khả dụng
        for (const detail of finalDetails) {
          const room = await roomRepository.findById(detail.roomId);
          if (!room || room.roomTypeId !== roomClass || room.status === "Maintenance") {
            throw { status: 400, message: `Phòng ${detail.roomId} không khả dụng hoặc không thuộc hạng phòng này` };
          }
          const overlap = await bookingRepository.findOverlappingByRoom(detail.roomId, start, end);
          if (overlap) {
            throw { status: 400, message: `Phòng ${detail.roomId} đã bị trùng lịch` };
          }
        }
      }


      // 4. Tính toán tổng tiền
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = roomType.price * nights * finalDetails.length;

      if (deposit && deposit > totalAmount) {
        throw { status: 400, message: "Tiền cọc không thể lớn hơn tổng tiền phòng" };
      }

      // 5. Tạo đơn đặt phòng
      const isToday = start.getTime() === now.getTime();
      const status = isToday ? "CheckedIn" : "Confirmed";

      const booking = await bookingRepository.create({
        customerId: finalCustomerId!,
        roomClass,
        startDate: start,
        endDate: end,
        roomQuantity: finalDetails.length,
        deposit: deposit || 0,
        totalAmount,
        details: finalDetails,
        status: status,
      });

      // 6. Cập nhật trạng thái phòng nếu khách nhận phòng ngay
      if (isToday) {
        for (const detail of finalDetails) {
          await roomRepository.updateStatus(detail.roomId, "Occupied");
        }
      }

      // 7. Ghi lịch sử
      await createBookingHistoryUseCase.execute({
        bookingId: booking.id,
        oldStatus: undefined,
        newStatus: status,
        userId: input.executorUserId,
      });

      return (await bookingRepository.findById(booking.id, { customer: true, rooms: true }))!;
    });
  },
};

export default staffCreateWalkInBookingUseCase;

