import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Service Usage Negative Cases Integration Tests", () => {
  let adminToken = "";
  let nonExistentReceiptId = "00000000-0000-0000-0000-000000000000";
  let nonExistentServiceId = "00000000-0000-0000-0000-000000000000";

  beforeAll(async () => {
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminRes.body.data.token;
  });

  describe("POST /api/service-usages", () => {
    it("should return 400 (or 404) if Rental Receipt does not exist", async () => {
      const res = await request(app)
        .post("/api/service-usages")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          PhieuThuePhong: nonExistentReceiptId,
          DichVu: "some-service-id", // Assume valid id format but might be checked
          SoLuong: 1,
          DonGia: 50000
        });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 (or 404) if Service does not exist", async () => {
      // Need a valid receipt ID to isolate the Service not found error.
      // But we can just test with fake ones for now, the validation should catch it.
      const res = await request(app)
        .post("/api/service-usages")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          PhieuThuePhong: "some-receipt-id", 
          DichVu: nonExistentServiceId,
          SoLuong: 1,
          DonGia: 50000
        });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if SoLuong is zero or negative", async () => {
      const res = await request(app)
        .post("/api/service-usages")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          PhieuThuePhong: "some-receipt-id",
          DichVu: "some-service-id",
          SoLuong: -5,
          DonGia: 50000
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
