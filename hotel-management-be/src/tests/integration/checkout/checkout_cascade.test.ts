import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";
import { bookingRepository, rentalReceiptRepository, roomRepository, bookingHistoryRepository } from "../../../repository/index.js";

describe("Checkout Cascade Integration Tests", () => {
  let adminToken = "";
  let paymentMethodId = "";
  let testStaffId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
  let testCustomerId = "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d";
  
  let multiRoomBookingId = "";
  let slip1Id = "";
  let slip2Id = "";

  beforeAll(async () => {
    // 1. Login
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminRes.body.data.token;


    // 2. Lấy Payment Method
    const pmRes = await request(app).get("/api/payment-methods").set("Authorization", `Bearer ${adminToken}`);
    paymentMethodId = pmRes.body.data[0]._id;

    // 3. Setup Dữ liệu: 1 Booking có 2 phòng
    const booking = await bookingRepository.create({
      code: "DP-CASCADE-TEST",
      customerId: testCustomerId,
      roomClass: "Normal",
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      roomQuantity: 2,
      deposit: 1000000,
      totalAmount: 2000000,
      status: "CheckedIn",
      details: [
        { code: "CT-1", roomId: "room-1" },
        { code: "CT-2", roomId: "room-2" }
      ],
    });
    multiRoomBookingId = booking.id;

    // 4. Check-in phòng 1
    const slip1 = await rentalReceiptRepository.create({
      code: "PTP-CASC-1",
      bookingId: multiRoomBookingId,
      roomId: "room-1",
      checkInStaffId: testStaffId,
      adjustedPrice: 500000,
      status: "CheckedIn",
      checkInDate: new Date(),
      expectedCheckOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    slip1Id = slip1.id;

    // 5. Check-in phòng 2
    const slip2 = await rentalReceiptRepository.create({
      code: "PTP-CASC-2",
      bookingId: multiRoomBookingId,
      roomId: "room-2",
      checkInStaffId: testStaffId,
      adjustedPrice: 500000,
      status: "CheckedIn",
      checkInDate: new Date(),
      expectedCheckOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    slip2Id = slip2.id;
    
    // Đảm bảo trạng thái phòng ban đầu là Occupied
    await roomRepository.updateStatus("room-1", "Occupied");
    await roomRepository.updateStatus("room-2", "Occupied");
  });

  it("should handle multi-room checkout correctly for the entire booking", async () => {
    // --- Thực hiện Checkout cho Booking (thông qua 1 trong các slip) ---
    console.log("Step: Checkout via slip1Id");
    const res = await request(app)
      .post("/api/invoices/checkout")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        DatPhong: slip1Id,
        PhuongThucThanhToan: paymentMethodId,
      });

    expect(res.status).toBe(201);

    // KIỂM TRA: Cả hai phòng đều phải được chuyển sang Cleaning
    const room1 = await roomRepository.findById("room-1");
    expect(room1?.status).toBe("Cleaning");

    const room2 = await roomRepository.findById("room-2");
    expect(room2?.status).toBe("Cleaning");

    // KIỂM TRA: Cả hai slip đều phải được CheckedOut
    const slip1 = await rentalReceiptRepository.findById(slip1Id);
    expect(slip1?.status).toBe("CheckedOut");

    const slip2 = await rentalReceiptRepository.findById(slip2Id);
    expect(slip2?.status).toBe("CheckedOut");

    // KIỂM TRA: Đơn đặt phòng phải là CheckedOut
    const bookingFinal = await bookingRepository.findById(multiRoomBookingId);
    expect(bookingFinal?.status).toBe("CheckedOut");

    // Kiểm tra Lịch sử
    const history = await bookingHistoryRepository.findByBookingId(multiRoomBookingId);
    const hasCheckoutLog = history.some(h => h.newStatus === "CheckedOut");
    expect(hasCheckoutLog).toBe(true);
    
    console.log("Bulk Checkout Test Passed!");
  });
});
