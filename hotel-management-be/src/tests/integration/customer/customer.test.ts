import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Customer API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";
  // ID chuẩn của Customer One từ SEED data
  const SEED_CUSTOMER_ID = "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d";

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

  describe("Customer Profile Access", () => {
    it("should return personal profile via /api/customers/me", async () => {
      const res = await request(app)
        .get("/api/customers/me")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(SEED_CUSTOMER_ID);
      expect(res.body.data.HoTen).toBe("Customer One");
      expect(res.body.data.MaKH).toBe("KH001");
    });

    it("should allow updating own profile", async () => {
      const res = await request(app)
        .put("/api/customers/me")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          HoTen: "Customer One Updated",
          SDT: "0987654321",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.HoTen).toBe("Customer One Updated");
    });
  });

  describe("Admin Management", () => {
    it("should allow admin to list all customers", async () => {
      const res = await request(app)
        .get("/api/customers")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((c: any) => c._id === SEED_CUSTOMER_ID)).toBe(true);
    });

    it("should allow admin to get customer by id", async () => {
      const res = await request(app)
        .get(`/api/customers/${SEED_CUSTOMER_ID}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(SEED_CUSTOMER_ID);
    });
  });
});
