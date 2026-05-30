import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Booking Negative Cases Integration Tests", () => {
  let customerToken = "";

  beforeAll(async () => {
    // Login as Customer
    const customerLogin = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerLogin.body.data.token;
  });

  describe("POST /api/bookings/customer/", () => {
    it("should return 400 if NgayDi is before NgayDen", async () => {
      const res = await request(app)
        .post("/api/bookings/customer/")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          HangPhong: "1",
          NgayDen: "2026-06-05", // NgayDen sau NgayDi
          NgayDi: "2026-06-01",
          TienCoc: 1000000,
          ChiTietDatPhong: [{ MaCTDP: "CT-CUST-INVALID", Phong: "room-1" }]
        });

      // API should validate and return a bad request
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if missing required fields (e.g. HangPhong)", async () => {
      const res = await request(app)
        .post("/api/bookings/customer/")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          NgayDen: "2026-06-01",
          NgayDi: "2026-06-05",
          TienCoc: 1000000,
          ChiTietDatPhong: [{ MaCTDP: "CT-CUST-INVALID", Phong: "room-1" }]
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
    
    it("should return 400 if booking date is in the past", async () => {
      const pastDate = "2020-01-01"; // Past date
      const res = await request(app)
        .post("/api/bookings/customer/")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          HangPhong: "1",
          NgayDen: pastDate,
          NgayDi: "2020-01-05",
          TienCoc: 1000000,
          ChiTietDatPhong: [{ MaCTDP: "CT-CUST-INVALID", Phong: "room-1" }]
        });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});
