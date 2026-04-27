import { describe, it, expect, beforeAll } from "vitest";
import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "../../../server.js";

describe("Rental Receipt API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let receptionistToken = "";
  let createdReceiptId = "";

  beforeAll(async () => {
    // Login as Default Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // Login as Receptionist (Staff)
    const receptionistLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "receptionist_test_rental",
      MatKhau: "123456",
    }).catch(() => null);

    if (receptionistLoginRes && receptionistLoginRes.body.token) {
      receptionistToken = receptionistLoginRes.body.token;
    } else {
      receptionistToken = adminToken; // Fallback if test receptionist not created
    }
  });

  describe("POST /api/rental-receipts (Check-in)", () => {
    it("should allow check-in with Vietnamese fields and return populated object", async () => {
      const res = await request(app)
        .post("/api/rental-receipts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          DatPhong: "booking-1",
          Phong: "room-1",
          NgayTraDuKien: new Date(Date.now() + 86400000).toISOString(),
          SoKhachThucTe: 2,
          DonGiaSauDieuChinh: 500000,
          NhanVienCheckIn: "staff-1",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      
      const data = res.body.data;
      expect(data._id).toBeDefined(); // Legacy field
      expect(data.MaPTP).toBeDefined(); // Legacy field
      expect(typeof data.DatPhong).toBe("object"); // Populated
      expect(typeof data.Phong).toBe("object"); // Populated
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

  describe("POST /api/rental-receipts/:id/checkout", () => {
    it("should checkout and return status CheckedOut", async () => {
      const res = await request(app)
        .post(`/api/rental-receipts/${createdReceiptId}/checkout`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.TrangThai).toBe("CheckedOut");
    });
  });

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
