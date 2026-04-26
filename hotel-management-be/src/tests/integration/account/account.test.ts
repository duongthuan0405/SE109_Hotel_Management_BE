import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Account API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";
  let customerId = "";
  let newAccountId = "";

  beforeAll(async () => {
    // 1. Login as Default Admin (Pre-seeded in UserRepository)
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // 2. Register & Login as Customer (Public registration always creates Customer)
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "customer_test_acc",
      MatKhau: "123456",
    });
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer_test_acc",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.token;

    // Get customer ID from me profile
    const meRes = await request(app)
      .get("/api/accounts/me")
      .set("Authorization", `Bearer ${customerToken}`);
    customerId = meRes.body.data._id;
  });

  describe("Self-Service APIs", () => {
    it("should get personal account info via GET /me", async () => {
      const res = await request(app)
        .get("/api/accounts/me")
        .set("Authorization", `Bearer ${customerToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.TenDangNhap).toBe("customer_test_acc");
      expect(res.body.data.VaiTro).toBe("Customer");
    });

    it("should fail to change password with wrong old password", async () => {
      const res = await request(app)
        .put("/api/accounts/me/change-password")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          MatKhauCu: "wrongpass",
          MatKhauMoi: "newpass123",
        });
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Admin CRUD APIs", () => {
    it("should deny getting all accounts if not Admin", async () => {
      const res = await request(app)
        .get("/api/accounts")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should allow Admin to get all accounts", async () => {
      const res = await request(app)
        .get("/api/accounts")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should allow Admin to get a specific account by ID", async () => {
      const res = await request(app)
        .get(`/api/accounts/${customerId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.TenDangNhap).toBe("customer_test_acc");
    });

    it("should allow Admin to create a new account (Staff/Receptionist)", async () => {
      const res = await request(app)
        .post("/api/accounts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          TenDangNhap: "staff_acc_new",
          MatKhau: "123456",
          VaiTro: "Receptionist",
        });
      expect(res.status).toBe(201);
      expect(res.body.data.TenDangNhap).toBe("staff_acc_new");
      expect(res.body.data.VaiTro).toBe("Receptionist");
      newAccountId = res.body.data._id;
    });

    it("should allow Admin to update account role", async () => {
      const res = await request(app)
        .put(`/api/accounts/${newAccountId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          VaiTro: "Manager",
        });
      expect(res.status).toBe(200);
      expect(res.body.data.VaiTro).toBe("Manager");
    });

    it("should allow Admin to delete account", async () => {
      const res = await request(app)
        .delete(`/api/accounts/${newAccountId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
