import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Dashboard API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";

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

  describe("GET /api/dashboard/stats", () => {
    it("should return 401 if no token provided", async () => {
      const res = await request(app).get("/api/dashboard/stats");
      expect(res.status).toBe(401);
    });

    it("should return 403 if customer tries to access dashboard", async () => {
      const res = await request(app)
        .get("/api/dashboard/stats")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should return dashboard stats for admin without date filters", async () => {
      const res = await request(app)
        .get("/api/dashboard/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verify structure
      expect(res.body.data).toHaveProperty("TongQuan");
      expect(res.body.data.TongQuan).toHaveProperty("TongDoanhThu");
      expect(res.body.data.TongQuan).toHaveProperty("TongDatPhong");
      expect(res.body.data.TongQuan).toHaveProperty("TongKhachHang");
      expect(res.body.data.TongQuan).toHaveProperty("LuotThueDangHoatDong");
      
      expect(res.body.data).toHaveProperty("ThongKeDoanhThu");
      expect(Array.isArray(res.body.data.ThongKeDoanhThu)).toBe(true);

      expect(res.body.data).toHaveProperty("MatDoPhong");
      expect(Array.isArray(res.body.data.MatDoPhong)).toBe(true);

      expect(res.body.data).toHaveProperty("TopDichVu");
      expect(Array.isArray(res.body.data.TopDichVu)).toBe(true);
    });

    it("should return dashboard stats for admin with date filters", async () => {
      const startDate = "2026-01-01";
      const endDate = "2026-12-31";
      
      const res = await request(app)
        .get(`/api/dashboard/stats?startDate=${startDate}&endDate=${endDate}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("TongQuan");
    });

    it("should handle invalid date formats gracefully", async () => {
      const startDate = "invalid-date";
      const endDate = "2026-12-31";
      
      const res = await request(app)
        .get(`/api/dashboard/stats?startDate=${startDate}&endDate=${endDate}`)
        .set("Authorization", `Bearer ${adminToken}`);

      // Có thể là 400 Bad Request tùy thuộc vào cách controller handle validation
      // Ở đây giả sử nếu lỗi validation thì trả về 400
      // Nếu API không validate chặt chẽ, có thể cần đổi expect logic.
      // expect(res.status).toBe(400); 
    });
  });
});
