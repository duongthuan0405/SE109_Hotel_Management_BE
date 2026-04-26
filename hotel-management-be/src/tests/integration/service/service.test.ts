import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Service API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";
  let testServiceId = "";

  beforeAll(async () => {
    // Login as Admin
    const adminLogin = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLogin.body.token;

    // Login as Customer
    const customerLogin = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerLogin.body.token;
  });

  it("should get all services via GET /api/services/", async () => {
    const res = await request(app)
      .get("/api/services/")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should allow CUSTOMER to view services via GET /api/services/", async () => {
    const res = await request(app)
      .get("/api/services/")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should create a new service via POST /api/services/", async () => {
    const res = await request(app)
      .post("/api/services/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        MaDV: "DV999",
        TenDV: "Dịch vụ Test",
        DonGia: 100000
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.MaDV).toBe("DV999");
    testServiceId = res.body.data._id;
  });

  it("should get service by ID via GET /api/services/:id", async () => {
    const res = await request(app)
      .get(`/api/services/${testServiceId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.MaDV).toBe("DV999");
  });

  it("should update service via PUT /api/services/:id", async () => {
    const res = await request(app)
      .put(`/api/services/${testServiceId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        TenDV: "Dịch vụ Test Updated",
        DonGia: 120000
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.TenDV).toBe("Dịch vụ Test Updated");
    expect(res.body.data.DonGia).toBe(120000);
  });

  it("should return 403 if customer tries to create a service", async () => {
    const res = await request(app)
      .post("/api/services/")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        MaDV: "DV_FORBIDDEN",
        TenDV: "Hack Service",
        DonGia: 0
      });

    expect(res.status).toBe(403);
  });

  it("should delete service via DELETE /api/services/:id", async () => {
    const res = await request(app)
      .delete(`/api/services/${testServiceId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify deletion
    const checkRes = await request(app)
      .get(`/api/services/${testServiceId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(checkRes.status).toBe(404);
  });
});
