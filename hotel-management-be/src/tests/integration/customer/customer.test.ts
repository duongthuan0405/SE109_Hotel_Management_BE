import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Customer API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let customerToken = "";
  let customerId = "";

  beforeAll(async () => {
    // Login as Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // Register & Login as Customer
    const cmnd = "TEST_" + Date.now();
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "customer_test_compat",
      MatKhau: "123456",
      HoTen: "Khách Hàng Test",
      CMND: cmnd,
      SDT: "0123456789",
      Email: `test_${Date.now()}@customer.com`,
    });
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer_test_compat",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.token;
  });

  describe("Customer Profile & Compatibility", () => {
    it("should return customer profile with legacy fields and populated account", async () => {
      const res = await request(app)
        .get("/api/customers/me")
        .set("Authorization", `Bearer ${customerToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const data = res.body.data;
      expect(data._id).toBeDefined();
      expect(data.MaKH).toBeDefined();
      expect(data.HoTen).toBe("Khách Hàng Test");
      expect(data.CMND).toBeDefined();
      
      // Kiểm tra populate TaiKhoan (Account)
      expect(data.TaiKhoan).toBeDefined();
      expect(data.TaiKhoan.TenDangNhap).toBe("customer_test_compat");
      
      customerId = data._id;
    });

    it("should allow updating profile with Vietnamese keys", async () => {
      const res = await request(app)
        .put("/api/customers/me")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          HoTen: "Khách Hàng Updated",
          DiaChi: "123 Legacy Street",
        });
      
      expect(res.status).toBe(200);
      expect(res.body.data.HoTen).toBe("Khách Hàng Updated");
      expect(res.body.data.DiaChi).toBe("123 Legacy Street");
    });
  });

  describe("Admin Management Compatibility", () => {
    it("should allow admin to list all customers with full data", async () => {
      const res = await request(app)
        .get("/api/customers")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      const customer = res.body.data.find((c: any) => c._id === customerId);
      expect(customer).toBeDefined();
      expect(customer.MaKH).toBeDefined();
    });

    it("should allow admin to get customer by id", async () => {
      const res = await request(app)
        .get(`/api/customers/${customerId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.HoTen).toBe("Khách Hàng Updated");
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
