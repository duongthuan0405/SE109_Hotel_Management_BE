import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";
import { bookingRepository } from "../../../repository/index.js";

describe("Checkout Negative Cases Integration Tests", () => {
  let adminToken = "";
  let invalidPaymentMethodId = "00000000-0000-0000-0000-000000000000";
  let nonExistentBookingId = "00000000-0000-0000-0000-000000000000";
  let validBookingId = "";

  beforeAll(async () => {
    // Login as Admin
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminRes.body.data.token;

    // Create a real booking to test validation errors that happen after DB lookup
    const booking = await bookingRepository.create({
      code: "DP-NEG-TEST",
      customerId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      roomClass: "Normal",
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      roomQuantity: 1,
      deposit: 100000,
      totalAmount: 500000,
      status: "CheckedIn",
      details: [
        { code: "CT-NEG-1", roomId: "room-1" }
      ],
    });
    validBookingId = booking.id;
  });

  describe("POST /api/invoices/checkout", () => {
    it("should return 400 (or 404) if booking does not exist", async () => {
      const res = await request(app)
        .post("/api/invoices/checkout")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          DatPhong: nonExistentBookingId,
          PhuongThucThanhToan: invalidPaymentMethodId,
        });

      // API có thể trả về 404 Not Found hoặc 400 Bad Request tùy logic
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if payload is missing DatPhong", async () => {
      const res = await request(app)
        .post("/api/invoices/checkout")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          PhuongThucThanhToan: invalidPaymentMethodId,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if payload is missing PhuongThucThanhToan", async () => {
      const res = await request(app)
        .post("/api/invoices/checkout")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          DatPhong: validBookingId,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
