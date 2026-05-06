import { bookingRepository, roomRepository, roomTypeRepository, unitOfWork } from "../../repository/index.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";
import type { IStaffCreateBookingUseCase, CreateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffCreateBookingUseCase: IStaffCreateBookingUseCase = {
  execute: async (input: CreateBookingUCInput): Promise<BookingUCOutput> => {
    return await unitOfWork.runInTransaction(async () => {
      const { customerId, roomClass, startDate, endDate, roomQuantity, deposit, details, executorUserId } = input;
      const quantity = roomQuantity || 1;

      if (!customerId || !roomClass || !startDate || !endDate) {
        throw { status: 400, message: "Vui lòng cung cấp đủ thông tin đặt phòng (Khách hàng, Hạng phòng, Ngày đến/đi)" };
      }

      // 0. Kiểm tra hạng phòng tồn tại
      const roomType = await roomTypeRepository.findById(roomClass);
      if (!roomType) {
        throw { status: 404, message: "Hạng phòng không tồn tại" };
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw { status: 400, message: "Ngày nhận phòng hoặc ngày trả phòng không hợp lệ" };
      }

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
            throw { status: 400, message: `Phòng ${room.code} đã bị trùng lịch trong khoảng thời gian này` };
          }
        }
      }


      // 3. Tính toán tổng tiền
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = roomType.price * nights * finalDetails.length;

      if (deposit && deposit > totalAmount) {
        throw { status: 400, message: "Tiền cọc không thể lớn hơn tổng tiền phòng" };
      }

      // 5. Tạo đơn đặt phòng
      const booking = await bookingRepository.create({
        customerId,
        roomClass,
        startDate: start,
        endDate: end,
        roomQuantity: finalDetails.length,
        deposit: deposit || 0,
        totalAmount,
        details: finalDetails.map(d => ({ roomId: d.roomId })), // Để Repo tự sinh mã CTDP
        status: "Confirmed",
      });

      // 6. Ghi lịch sử tự động
      await createBookingHistoryUseCase.execute({
        bookingId: booking.id,
        oldStatus: undefined,
        newStatus: "Confirmed",
        userId: input.executorUserId, // ID Nhân viên thực hiện
      });

      return (await bookingRepository.findById(booking.id, { customer: true, rooms: true }))!;
    });
  },
};

export default staffCreateBookingUseCase;

