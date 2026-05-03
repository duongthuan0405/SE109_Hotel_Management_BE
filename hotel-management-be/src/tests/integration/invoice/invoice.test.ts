import { describe, it, expect, beforeAll } from "vitest";
import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "../../../server.js";

describe("Invoice API Integration Tests", () => {
  let adminToken = "";
  let paymentMethodId = "";
  // In our mock RentalReceiptRepository, we have slip-1, slip-2, slip-3
  // slip-1 corresponds to booking-1 (Customer 1, deposit 500k, 2 nights at Normal = 400k/night * 2 = 800k)
  let testStaffId = "";
  let testCustomerId = "";
  let rentalSlipId = "";
  let createdInvoiceId = "";

  beforeAll(async () => {
    testStaffId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    testCustomerId = "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d";

    // Login as Admin
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminRes.body.data.token;


    // Get a payment method ID
    const pmRes = await request(app).get("/api/payment-methods").set("Authorization", `Bearer ${adminToken}`);
    paymentMethodId = pmRes.body.data[0]._id;

    // Create mock dependencies for Invoice Tests
    // 1. Create a Booking
    const { bookingRepository, rentalReceiptRepository, serviceUsageRepository } = await import("../../../repository/index.js");
    
    // We need customer id and roomClass
    const booking = await bookingRepository.create({
      code: "DP-INVOICE-TEST",
      customerId: testCustomerId,
      roomClass: "Normal",
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
      guestCount: 2,
      deposit: 500000,
      totalAmount: 800000,
      status: "CheckedIn",
      details: [],
    });

    // 2. Create a RentalSlip mapped to the booking
    const slip = await rentalReceiptRepository.create({
      code: "RS-1",
      bookingId: booking.id,
      roomId: "room-1",
      checkInStaffId: testStaffId,
      adjustedPrice: 400000, // 400k/night
      status: "CheckedIn",
      checkInDate: new Date(),
      expectedCheckOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      actualGuestCount: 2,
    });
    // Set slipId
    rentalSlipId = slip.id;

    // 3. Create Service Usages for this slip
    await serviceUsageRepository.create({
      code: "SU-1",
      rentalSlipId: rentalSlipId,
      serviceId: "svc-1",
      quantity: 1,
      unitPrice: 100000,
      totalAmount: 100000,
      status: "Completed",
      requestedAt: new Date(),
    });
    await serviceUsageRepository.create({
      code: "SU-2",
      rentalSlipId: rentalSlipId,
      serviceId: "svc-2",
      quantity: 1,
      unitPrice: 150000,
      totalAmount: 150000,
      status: "Completed",
      requestedAt: new Date(),
    });
  });

  describe("GET /api/invoices/preview", () => {
    it("should calculate correct preview totals for slip-1", async () => {
      const res = await request(app)
        .get(`/api/invoices/preview?phieuId=${rentalSlipId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const data = res.body.data;
      // Normal room: 400k. 2 nights => 800k. (Assume adjustedPrice is 400k or fallback to base)
      // Service usage for slip-1: In ServiceUsageRepository mock, slip-1 has "su-1" (Completed, 100k) and "su-2" (Completed, 150k). Total = 250k.
      // Deposit: booking-1 has 500k deposit.
      expect(data.roomTotal).toBe(800000);
      expect(data.serviceTotal).toBe(250000);
      expect(data.deposit).toBe(500000);
    });

    it("should fail without phieuId", async () => {
      const res = await request(app)
        .get(`/api/invoices/preview`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/invoices/checkout", () => {
    it("should auto-create checkout invoice AND automate room release, booking completion, and history tracking", async () => {
      const { rentalReceiptRepository, roomRepository, bookingRepository, bookingHistoryRepository } = await import("../../../repository/index.js");
      
      const res = await request(app)
        .post("/api/invoices/checkout")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          PhieuThuePhong: rentalSlipId,
          PhuongThucThanhToan: paymentMethodId,
          // TUYỆT ĐỐI KHÔNG gửi NhanVienThuNgan ở đây
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      const data = res.body.data;
      expect(data.TongThanhToan).toBe(550000);
      // KIỂM TRA: Nhân viên thu ngân phải là staff vừa tạo
      expect(data.NhanVienThuNgan._id).toBe(testStaffId); 
      
      createdInvoiceId = data._id;

      // === KIỂM TRA TỰ ĐỘNG HÓA ===
      
      // 1. Kiểm tra Phiếu thuê đã Checkout chưa
      const slip = await rentalReceiptRepository.findById(rentalSlipId);
      expect(slip?.status).toBe("CheckedOut");

      // 2. Kiểm tra Phòng đã được chuyển sang trạng thái dọn dẹp chưa
      const room = await roomRepository.findById("room-1");
      expect(room?.status).toBe("Cleaning");

      // 3. Kiểm tra Đơn đặt phòng đã kết thúc chưa
      if (slip?.bookingId) {
        const booking = await bookingRepository.findById(slip.bookingId);
        expect(booking?.status).toBe("CheckedOut");

        // 4. Kiểm tra Lịch sử đặt phòng đã được ghi tự động chưa
        const history = await bookingHistoryRepository.findByBookingId(slip.bookingId);
        const hasCheckoutLog = history.some(h => h.newStatus === "CheckedOut");
        expect(hasCheckoutLog).toBe(true);
      }
    });
  });

  describe("GET /api/invoices", () => {
    it("should return list of invoices", async () => {
      const res = await request(app)
        .get("/api/invoices")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/invoices/:id", () => {
    it("should get specific invoice with populated fields", async () => {
      const res = await request(app)
        .get(`/api/invoices/${createdInvoiceId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.PhieuThuePhong).toBeDefined();
    });
  });

  describe("PUT /api/invoices/:id", () => {
    it("should update payment status", async () => {
      const res = await request(app)
        .put(`/api/invoices/${createdInvoiceId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          TrangThaiThanhToan: "Refunded",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.TrangThaiThanhToan).toBe("Refunded");
    });
  });

  describe("DELETE /api/invoices/:id", () => {
    it("should delete invoice", async () => {
      const res = await request(app)
        .delete(`/api/invoices/${createdInvoiceId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
