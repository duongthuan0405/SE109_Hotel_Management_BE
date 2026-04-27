import { describe, it, expect, beforeAll } from "vitest";
import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "../../../server.js";

describe("Rental Receipt API Integration Tests", () => {
  let adminToken = "";
  let receptionistToken = "";
  let customerToken = "";
  let createdReceiptId = "";

  beforeAll(async () => {
    // 1. Login as Default Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // 2. Create Receptionist
    await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        TenDangNhap: "receptionist_test_rental",
        MatKhau: "123456",
        VaiTro: "Receptionist",
      });
    const receptionistLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "receptionist_test_rental",
      MatKhau: "123456",
    });
    receptionistToken = receptionistLoginRes.body.token;

    // 3. Register as Customer
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "customer_test_rental",
      MatKhau: "123456",
    });
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer_test_rental",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.token;
  });

  describe("POST /api/rental-receipts (Check-in)", () => {
    it("should deny check-in if not authenticated", async () => {
      const res = await request(app).post("/api/rental-receipts").send({
        DatPhong: "booking-1",
        Phong: "room-1",
        NgayTraDuKien: new Date(Date.now() + 86400000).toISOString(),
        SoKhachThucTe: 2,
        DonGiaSauDieuChinh: 500000,
        NhanVienCheckIn: "staff-1",
      });
      expect(res.status).toBe(401);
    });

    it("should allow check-in if authenticated as Receptionist", async () => {
      const res = await request(app)
        .post("/api/rental-receipts")
        .set("Authorization", `Bearer ${receptionistToken}`)
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
      expect(res.body.data.slipCode).toBeDefined();
      createdReceiptId = res.body.data.id;
    });
  });

  describe("GET /api/rental-receipts", () => {
    it("should get all rental receipts for staff", async () => {
      const res = await request(app)
        .get("/api/rental-receipts")
        .set("Authorization", `Bearer ${receptionistToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should deny access for customers", async () => {
      const res = await request(app)
        .get("/api/rental-receipts")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/rental-receipts/:id", () => {
    it("should get receipt by id", async () => {
      const res = await request(app)
        .get(`/api/rental-receipts/${createdReceiptId}`)
        .set("Authorization", `Bearer ${receptionistToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdReceiptId);
    });
  });

  describe("PUT /api/rental-receipts/:id", () => {
    it("should update receipt", async () => {
      const res = await request(app)
        .put(`/api/rental-receipts/${createdReceiptId}`)
        .set("Authorization", `Bearer ${receptionistToken}`)
        .send({
          SoKhachThucTe: 3,
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.actualGuestCount).toBe(3);
    });
  });

  describe("POST /api/rental-receipts/:id/checkout", () => {
    it("should checkout successfully", async () => {
      const res = await request(app)
        .post(`/api/rental-receipts/${createdReceiptId}/checkout`)
        .set("Authorization", `Bearer ${receptionistToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("CheckedOut");
    });
  });

  describe("DELETE /api/rental-receipts/:id", () => {
    it("should deny deletion for receptionist", async () => {
      const res = await request(app)
        .delete(`/api/rental-receipts/${createdReceiptId}`)
        .set("Authorization", `Bearer ${receptionistToken}`);
      expect(res.status).toBe(403);
    });

    it("should allow deletion for admin", async () => {
      const res = await request(app)
        .delete(`/api/rental-receipts/${createdReceiptId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
