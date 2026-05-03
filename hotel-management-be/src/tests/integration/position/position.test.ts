import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Position API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let customerToken = "";
  let createdPositionId = "";

  beforeAll(async () => {
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.data.token;

    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.data.token;
  });

  describe("GET /api/positions", () => {
    it("should deny access without token", async () => {
      const res = await request(app).get("/api/positions");
      expect(res.status).toBe(401);
    });

    it("should deny access for Customer role", async () => {
      const res = await request(app)
        .get("/api/positions")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should return list with Vietnamese fields for Admin", async () => {
      const res = await request(app)
        .get("/api/positions")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);

      const first = res.body.data[0];
      expect(first._id).toBeDefined();
      expect(first.MaChucVu).toBeDefined();
      expect(first.TenChucVu).toBeDefined();
    });
  });

  describe("GET /api/positions/:id", () => {
    it("should get specific position", async () => {
      const res = await request(app)
        .get("/api/positions/pos-1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.MaChucVu).toBe("CV001");
      expect(res.body.data.TenChucVu).toBe("Quản lý");
    });

    it("should return 404 for non-existent", async () => {
      const res = await request(app)
        .get("/api/positions/non-existent")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/positions", () => {
    it("should create position with Vietnamese fields", async () => {
      const res = await request(app)
        .post("/api/positions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          TenChucVu: "Bảo vệ",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaChucVu).toBeDefined();
      expect(res.body.data.TenChucVu).toBe("Bảo vệ");
      createdPositionId = res.body.data._id;
    });


    it("should return 400 if TenChucVu missing", async () => {
      const res = await request(app)
        .post("/api/positions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/positions/:id", () => {
    it("should update position name", async () => {
      const res = await request(app)
        .put(`/api/positions/${createdPositionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ TenChucVu: "Bảo vệ trưởng" });

      expect(res.status).toBe(200);
      expect(res.body.data.TenChucVu).toBe("Bảo vệ trưởng");
    });

    it("should return 400 if TenChucVu missing", async () => {
      const res = await request(app)
        .put(`/api/positions/${createdPositionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent", async () => {
      const res = await request(app)
        .put("/api/positions/non-existent")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ TenChucVu: "Test" });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/positions/:id", () => {
    it("should deny delete for Customer", async () => {
      const res = await request(app)
        .delete(`/api/positions/${createdPositionId}`)
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should delete position as Admin", async () => {
      const res = await request(app)
        .delete(`/api/positions/${createdPositionId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for already deleted", async () => {
      const res = await request(app)
        .delete(`/api/positions/${createdPositionId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });
});
