import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Customer API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";
  let customerId = "";

  beforeAll(async () => {
    // 1. Login as Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // 2. Register & Login as Customer
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "customer_test_profile",
      MatKhau: "123456",
      HoTen: "Nguyễn Văn Test",
      CMND: "TEST_" + Date.now(),
      SDT: "0123456789",
      Email: "test@customer.com",
    });
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer_test_profile",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.token;
  });

  describe("Customer Self-Service (GET/PUT /me)", () => {
    it("should get my own profile", async () => {
      const res = await request(app)
        .get("/api/customers/me")
        .set("Authorization", `Bearer ${customerToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.HoTen).toBe("Nguyễn Văn Test");
      expect(res.body.data.MaKH).toBeDefined();
      customerId = res.body.data._id;
    });

    it("should update my own profile", async () => {
      const res = await request(app)
        .put("/api/customers/me")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          HoTen: "Nguyễn Văn Updated",
          DiaChi: "456 Đường XYZ",
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.HoTen).toBe("Nguyễn Văn Updated");
      expect(res.body.data.DiaChi).toBe("456 Đường XYZ");
    });
  });

  describe("Admin Management (GET /api/customers)", () => {
    it("should allow admin to get all customers", async () => {
      const res = await request(app)
        .get("/api/customers")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should allow admin to get customer by id", async () => {
      const res = await request(app)
        .get(`/api/customers/${customerId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.HoTen).toBe("Nguyễn Văn Updated");
    });

    it("should deny customer from deleting themselves via admin API", async () => {
      const res = await request(app)
        .delete(`/api/customers/${customerId}`)
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should allow admin to delete a customer", async () => {
      const res = await request(app)
        .delete(`/api/customers/${customerId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
