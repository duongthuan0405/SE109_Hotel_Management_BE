import { describe, it, expect, beforeAll } from "vitest";
import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "../../../server.js";

describe("Payment Method API Integration Tests", () => {
  let adminToken = "";
  let managerToken = "";
  let createdId = "";

  beforeAll(async () => {
    // Login as Admin
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminRes.body.token;

    // Login as Manager
    const managerRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "manager1", // Oh wait, I don't have manager1 in mock. Will use Customer instead below.
      MatKhau: "123456",
    });
    managerToken = managerRes.body.token;
  });

  describe("GET /api/payment-methods", () => {
    it("should get list of payment methods", async () => {
      const res = await request(app)
        .get("/api/payment-methods")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].MaPTTT).toBe("TM");
    });
  });

  describe("POST /api/payment-methods", () => {
    it("should create a new payment method", async () => {
      const res = await request(app)
        .post("/api/payment-methods")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaPTTT: "MOMO",
          TenPTTT: "Ví Momo",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaPTTT).toMatch(/^PTTT\d+/);
      expect(res.body.data.TenPTTT).toBe("Ví Momo");
      createdId = res.body.data._id;
    });
  });

  describe("PUT /api/payment-methods/:id", () => {
    it("should update payment method", async () => {
      const res = await request(app)
        .put(`/api/payment-methods/${createdId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          TenPTTT: "Momo Wallet",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.TenPTTT).toBe("Momo Wallet");
    });
  });

  describe("DELETE /api/payment-methods/:id", () => {
    it("should delete payment method", async () => {
      const res = await request(app)
        .delete(`/api/payment-methods/${createdId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
