import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Account API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";

  beforeAll(async () => {
    // Login as Admin
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminRes.body.token;

    // Login as Customer
    const customerRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerRes.body.token;
  });

  describe("GET /api/accounts/me", () => {
    it("should return admin account info", async () => {
      const res = await request(app)
        .get("/api/accounts/me")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.TenDangNhap).toBe("admin");
      expect(res.body.data.VaiTro).toBe("Admin");
    });

    it("should return customer account info", async () => {
      const res = await request(app)
        .get("/api/accounts/me")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.TenDangNhap).toBe("customer1");
      expect(res.body.data.VaiTro).toBe("Customer");
    });
  });

  describe("PUT /api/accounts/change-password", () => {
    it("should allow changing password", async () => {
      const res = await request(app)
        .put("/api/accounts/me/change-password")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          MatKhauCu: "123456",
          MatKhauMoi: "newpassword123",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
