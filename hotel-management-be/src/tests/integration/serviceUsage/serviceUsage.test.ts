import { describe, it, expect, beforeAll } from "vitest";
import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "../../../server.js";

describe("Service Usage API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let createdUsageId = "";

  beforeAll(async () => {
    // Login as Default Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // Tạo phiếu thuê phòng trước (cần cho service usage)
    await request(app)
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
  });

  describe("POST /api/service-usages", () => {
    it("should create service usage with Vietnamese fields and return populated object", async () => {
      const res = await request(app)
        .post("/api/service-usages")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaSDV: "SDDV001",
          PhieuThuePhong: "room-1", // sẽ dùng ID rental slip thực tế khi có DB
          DichVu: "service-1",
          SoLuong: 2,
          DonGia: 50000,
          ThanhTien: 100000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      const data = res.body.data;
      expect(data._id).toBeDefined();
      expect(data.MaSDDV).toBe("SDDV001");
      expect(data.SoLuong).toBe(2);
      expect(data.DonGia).toBe(50000);
      expect(data.ThanhTien).toBe(100000);
      expect(data.TrangThai).toBe("Completed");

      createdUsageId = data._id;
    });

    it("should reject duplicate code", async () => {
      const res = await request(app)
        .post("/api/service-usages")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaSDV: "SDDV001",
          PhieuThuePhong: "room-1",
          DichVu: "service-1",
          SoLuong: 1,
          DonGia: 30000,
          ThanhTien: 30000,
        });

      expect(res.status).toBe(409);
    });

    it("should reject missing required fields", async () => {
      const res = await request(app)
        .post("/api/service-usages")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaSDV: "SDDV002",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/service-usages", () => {
    it("should return list with legacy fields", async () => {
      const res = await request(app)
        .get("/api/service-usages")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const firstItem = res.body.data[0];
      expect(firstItem._id).toBeDefined();
      expect(firstItem.MaSDDV).toBeDefined();
      expect(firstItem.TrangThai).toBeDefined();
      expect(firstItem.SoLuong).toBeDefined();
      expect(firstItem.DonGia).toBeDefined();
      expect(firstItem.ThanhTien).toBeDefined();
    });
  });

  describe("GET /api/service-usages/:id", () => {
    it("should get single service usage with full legacy compatibility", async () => {
      const res = await request(app)
        .get(`/api/service-usages/${createdUsageId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(createdUsageId);
      expect(res.body.data.MaSDDV).toBe("SDDV001");
    });

    it("should return 404 for non-existent id", async () => {
      const res = await request(app)
        .get("/api/service-usages/non-existent-id")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/service-usages/customer/:customerId", () => {
    it("should return service usages for a customer", async () => {
      const res = await request(app)
        .get("/api/service-usages/customer/cust-1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("PUT /api/service-usages/:id", () => {
    it("should update service usage with Vietnamese fields", async () => {
      const res = await request(app)
        .put(`/api/service-usages/${createdUsageId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          SoLuong: 5,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.SoLuong).toBe(5);
    });

    it("should update status", async () => {
      const res = await request(app)
        .put(`/api/service-usages/${createdUsageId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          TrangThai: "Cancelled",
        });
      expect(res.status).toBe(200);
      expect(res.body.data.TrangThai).toBe("Cancelled");
    });
  });

  describe("DELETE /api/service-usages/:id", () => {
    it("should allow deletion by admin", async () => {
      const res = await request(app)
        .delete(`/api/service-usages/${createdUsageId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaSDDV).toBe("SDDV001");
    });

    it("should return 404 when deleting non-existent", async () => {
      const res = await request(app)
        .delete(`/api/service-usages/${createdUsageId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
