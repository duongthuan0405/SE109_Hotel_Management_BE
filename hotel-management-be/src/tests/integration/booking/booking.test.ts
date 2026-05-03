import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Booking API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";
  let testBookingId = "";
  let testCustomerId = "";

  beforeAll(async () => {
    // Login as Admin
    const adminLogin = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLogin.body.data.token;

    // Login as Customer
    const customerLogin = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerLogin.body.data.token;
  });

  describe("Customer Endpoints (Wrapped Response)", () => {
    it("should create a new booking for customer via POST /api/bookings/customer/", async () => {
      const res = await request(app)
        .post("/api/bookings/customer/")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          HangPhong: "1",
          NgayDen: "2026-06-01",
          NgayDi: "2026-06-05",
          SoKhach: 2,
          TienCoc: 1000000,
          ChiTietDatPhong: [{ MaCTDP: "CT-CUST-01", Phong: "room-1" }]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.HangPhong).toBe("1");
      expect(res.body.data._id).toBeDefined();
      
      // KIỂM TRA QUAN TRỌNG: Khách hàng phải tự động được gán đúng hồ sơ chuẩn UUID
      expect(res.body.data.KhachHang._id).toBe("a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d");
      
      testBookingId = res.body.data._id;
    });

    it("should get all personal bookings via GET /api/bookings/customer/", async () => {
      const res = await request(app)
        .get("/api/bookings/customer/")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should get booking detail via GET /api/bookings/customer/:id", async () => {
      const res = await request(app)
        .get(`/api/bookings/customer/${testBookingId}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testBookingId);
    });

    it("should cancel booking via POST /api/bookings/customer/:id/cancel", async () => {
      const res = await request(app)
        .post(`/api/bookings/customer/${testBookingId}/cancel`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.TrangThai).toBe("Cancelled");
    });
  });

  describe("Staff Endpoints (Wrapped Response)", () => {

    let staffBookingId = "";

    it("should create a walk-in booking via POST /api/bookings/walk-in", async () => {
      const res = await request(app)
        .post("/api/bookings/walk-in")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          HoTen: "Khách Vãng Lai",
          CMND: "123456789",
          SDT: "0987654321",
          HangPhong: "2",
          NgayDen: "2026-07-01",
          NgayDi: "2026-07-03",
          SoKhach: 2,
          TienCoc: 2000000,
          ChiTietDatPhong: [{ MaCTDP: "CT-STAFF-01", Phong: "room-3" }]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.HangPhong).toBe("2");
      expect(res.body.data._id).toBeDefined();
      staffBookingId = res.body.data._id;

    });

    it("should get all bookings for staff via GET /api/bookings/", async () => {
      const res = await request(app)
        .get("/api/bookings/")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((b: any) => b._id === staffBookingId)).toBe(true);

    });

    it("should update booking via PUT /api/bookings/:id", async () => {
      const res = await request(app)
        .put(`/api/bookings/${staffBookingId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          SoKhach: 3
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.SoKhach).toBe(3);

    });

    it("should delete booking via DELETE /api/bookings/:id", async () => {
      const res = await request(app)
        .delete(`/api/bookings/${staffBookingId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const checkRes = await request(app)
        .get("/api/bookings/")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(checkRes.body.data.some((b: any) => b._id === staffBookingId)).toBe(false);

    });
  });

  describe("Security & Role Access", () => {
    it("should return 401 if no token provided", async () => {
      const res = await request(app).get("/api/bookings/");
      expect(res.status).toBe(401);
    });

    it("should return 403 if customer tries to access staff endpoints", async () => {
      const res = await request(app)
        .get("/api/bookings/")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should return 403 if staff tries to access customer endpoints", async () => {
      const res = await request(app)
        .get("/api/bookings/customer/")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe("Ownership & IDOR Protection", () => {
    let otherCustomerToken = "";

    beforeAll(async () => {
      // Create another customer dynamically
      await request(app).post("/api/auth/register").send({
        TenDangNhap: "customer2",
        MatKhau: "123456",
        VaiTro: "Customer",
        HoTen: "Other Customer"
      });

      const loginRes = await request(app).post("/api/auth/login").send({
        TenDangNhap: "customer2",
        MatKhau: "123456",
      });
      otherCustomerToken = loginRes.body.data.token;
    });

    it("should return 403 if customer tries to GET another customer's booking", async () => {
      const res = await request(app)
        .get(`/api/bookings/customer/${testBookingId}`)
        .set("Authorization", `Bearer ${otherCustomerToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.message).toContain("không có quyền");
    });

    it("should return 403 if customer tries to UPDATE another customer's booking", async () => {
      const res = await request(app)
        .put(`/api/bookings/customer/${testBookingId}`)
        .set("Authorization", `Bearer ${otherCustomerToken}`)
        .send({ SoKhach: 99 });
      
      expect(res.status).toBe(403);
      expect(res.body.message).toContain("không có quyền");
    });

    it("should return 403 if customer tries to CANCEL another customer's booking", async () => {
      const res = await request(app)
        .post(`/api/bookings/customer/${testBookingId}/cancel`)
        .set("Authorization", `Bearer ${otherCustomerToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.message).toContain("không có quyền");
    });

    it("should return 403 if customer tries to DELETE another customer's booking", async () => {
      const res = await request(app)
        .delete(`/api/bookings/customer/${testBookingId}`)
        .set("Authorization", `Bearer ${otherCustomerToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.message).toContain("không có quyền");
    });

    it("should still allow STAFF to GET any booking without ownership check", async () => {
      const res = await request(app)
        .get(`/api/bookings/${testBookingId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testBookingId);

    });
  });
});
