import { bookingRepository, roomRepository, roomTypeRepository, unitOfWork } from "../../repository/index.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";
import type { IStaffUpdateBookingUseCase, UpdateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffUpdateBookingUseCase: IStaffUpdateBookingUseCase = {
  execute: async (input: UpdateBookingUCInput): Promise<BookingUCOutput> => {
    return await unitOfWork.runInTransaction(async () => {
      const { id, status, details, startDate, endDate, roomClass, roomQuantity } = input;
 
       const existingBooking = await bookingRepository.findById(id);
       if (!existingBooking) {
         throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
       }
 
       // 1. Kiểm tra tính hợp lệ của thay đổi
       const newStart = startDate ? new Date(startDate) : existingBooking.startDate;
       const newEnd = endDate ? new Date(endDate) : existingBooking.endDate;
       const newRoomClass = roomClass || existingBooking.roomClass;
       const newRoomQuantity = roomQuantity || existingBooking.roomQuantity;
       let newDetails = details || existingBooking.details;
 
       const roomType = await roomTypeRepository.findById(newRoomClass);
       if (!roomType) {
         throw { status: 404, message: "Hạng phòng không tồn tại" };
       }

       const now = new Date();
       now.setHours(0, 0, 0, 0);

       // Logic tự động gán phòng nếu chuyển sang CheckedIn mà chưa có phòng
       if (status === "CheckedIn" && (!newDetails || newDetails.length === 0)) {
         const allRooms = await roomRepository.findAll();
         const availableRoomsOfClass = allRooms.filter(r => r.roomTypeId === newRoomClass && r.status !== "Maintenance");

         let assignedRoomId: string | null = null;

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
            roomId: assignedRoomId
          }];
        } else {
          throw { status: 400, message: "Không thể tự động gán phòng vì không còn phòng trống" };
        }
      }

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
              throw { status: 400, message: `Phòng ${detail.roomId} không khả dụng cho hạng phòng này` };
            }
            const overlap = await bookingRepository.findOverlappingByRoom(detail.roomId, newStart, newEnd, id);
            if (overlap) {
              throw { status: 400, message: `Phòng ${room.code} đã bị trùng lịch trong khoảng thời gian mới` };
            }
          }
        }
      }


      // Recalculate totalAmount if needed
      const nights = Math.ceil((newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = roomType.price * nights * newRoomQuantity;

      // 2. Cập nhật thông tin đơn đặt phòng
      const oldStatus = existingBooking.status;
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

      // 3. Ghi lịch sử nếu trạng thái thay đổi
      if (status && status !== oldStatus) {
        await createBookingHistoryUseCase.execute({
          bookingId: updatedBooking.id,
          oldStatus: oldStatus as any,
          newStatus: status as any,
          userId: input.executorUserId,
        });
      }

      // 4. Cập nhật trạng thái phòng (Giải phóng phòng cũ nếu có thay đổi)
      if (details) {
        for (const oldDetail of existingBooking.details) {
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
        const now = new Date();
        now.setHours(0,0,0,0);
        if (newStart > now) {
          for (const detail of updatedBooking.details) {
            await roomRepository.updateStatus(detail.roomId, "Available");
          }
        }
      }

      return (await bookingRepository.findById(updatedBooking.id, { customer: true, rooms: true }))!;
    });
  },
};

export default staffUpdateBookingUseCase;

