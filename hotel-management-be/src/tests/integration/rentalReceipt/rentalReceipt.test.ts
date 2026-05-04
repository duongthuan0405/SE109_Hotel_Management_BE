import { describe, it, expect, beforeAll } from "vitest";
import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "../../../server.js";

describe("Rental Receipt API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let staffToken = "";
  let createdReceiptId = "";
  let testBookingId = "";
  let testStaffId = "";

  beforeAll(async () => {
    // 0. Khởi tạo hồ sơ cho Mock Repository để UseCase ánh xạ được ID
    const { bookingRepository } = await import("../../../repository/index.js");
    
    testStaffId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

    // Tạo một đơn đặt phòng mẫu để làm thủ tục check-in
    const booking = await bookingRepository.create({
      code: "DP001",
      customerId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      roomClass: "Normal",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      guestCount: 2,
      deposit: 0,
      totalAmount: 500000,
      status: "Confirmed",
      details: []
    });

    testBookingId = booking.id;

    // Login as Default Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.data.token;


    // Login as Staff
    const staffLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "staff_test_rental",
      MatKhau: "123456",
    }).catch(() => null);

    if (staffLoginRes && staffLoginRes.body.data && staffLoginRes.body.data.token) {
      staffToken = staffLoginRes.body.data.token;

    } else {
      staffToken = adminToken; // Fallback if test staff not created
    }
  });

  describe("POST /api/rental-receipts (Check-in)", () => {
    it("should allow check-in with Vietnamese fields and return populated object", async () => {
      const res = await request(app)
        .post("/api/rental-receipts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          DatPhong: testBookingId,
          Phong: "room-1",
          NgayTraDuKien: new Date(Date.now() + 86400000).toISOString(),
          SoKhachThucTe: 2,
          DonGiaSauDieuChinh: 500000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      
      const data = res.body.data;
      expect(data._id).toBeDefined(); // Legacy field
      expect(data.MaPTP).toBeDefined(); // Legacy field
      expect(typeof data.DatPhong).toBe("object"); // Populated
      expect(typeof data.Phong).toBe("object"); // Populated
      
      // KIỂM TRA QUAN TRỌNG: Nhân viên check-in phải được tự động gán đúng hồ sơ vừa tạo
      expect(data.NhanVienCheckIn._id).toBe(testStaffId);
      expect(data.NhanVienCheckIn.HoTen).toBeDefined(); // Populated
      
      createdReceiptId = data._id;
    });
  });

  describe("GET /api/rental-receipts", () => {
    it("should return list with legacy fields and populated data", async () => {
      const res = await request(app)
        .get("/api/rental-receipts")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      const firstItem = res.body.data[0];
      expect(firstItem._id).toBeDefined();
      expect(firstItem.MaPTP).toBeDefined();
      expect(firstItem.TrangThai).toBeDefined();
      // Kiểm tra populate
      expect(firstItem.Phong).toHaveProperty("MaPhong");
    });
  });

  describe("GET /api/rental-receipts/:id", () => {
    it("should get single receipt with full legacy compatibility", async () => {
      const res = await request(app)
        .get(`/api/rental-receipts/${createdReceiptId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(createdReceiptId);
      expect(res.body.data.MaPTP).toBeDefined();
      expect(res.body.data.DatPhong).toHaveProperty("MaDatPhong");
    });

    it("should return 404 for non-existent receipt", async () => {
      const res = await request(app)
        .get("/api/rental-receipts/non-existent-id")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/rental-receipts/:id", () => {
    it("should allow updating receipt with Vietnamese fields", async () => {
      const res = await request(app)
        .put(`/api/rental-receipts/${createdReceiptId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          SoKhachThucTe: 5,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.SoKhachThucTe).toBe(5);
    });
  });

/*
  describe("POST /api/rental-receipts/:id/checkout", () => {
    it("should checkout and return status CheckedOut", async () => {
      const res = await request(app)
        .post(`/api/rental-receipts/${createdReceiptId}/checkout`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.TrangThai).toBe("CheckedOut");
    });
  });
*/

  describe("DELETE /api/rental-receipts/:id", () => {
    it("should allow deletion by admin", async () => {
      const res = await request(app)
        .delete(`/api/rental-receipts/${createdReceiptId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
