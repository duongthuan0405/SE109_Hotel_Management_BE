import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Service Usage History API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";
  let createdRecordId = "";

  beforeAll(async () => {
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.token;
  });

  describe("GET /api/service-usage-history", () => {
    it("should deny access without token", async () => {
      const res = await request(app).get("/api/service-usage-history");
      expect(res.status).toBe(401);
    });

    it("should deny access for Customer role", async () => {
      const res = await request(app)
        .get("/api/service-usage-history")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should return list with Vietnamese fields", async () => {
      const res = await request(app)
        .get("/api/service-usage-history")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);

      if (res.body.data.length > 0) {
        const first = res.body.data[0];
        expect(first._id).toBeDefined();
        expect(first.MaLSDV).toBeDefined();
        expect(first.TrangThaiCu).toBeDefined();
        expect(first.TrangThaiMoi).toBeDefined();
        expect(first.ThoiGian).toBeDefined();
      }
    });
  });

  describe("GET /api/service-usage-history/:id", () => {
    it("should return specific record", async () => {
      const res = await request(app)
        .get("/api/service-usage-history/suh-1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.MaLSDV).toBe("LSDV001");
    });

    it("should return 404 for non-existent", async () => {
      const res = await request(app)
        .get("/api/service-usage-history/non-existent")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/service-usage-history/usage/:serviceUsageId", () => {
    it("should return history for specific service usage", async () => {
      const res = await request(app)
        .get("/api/service-usage-history/usage/su-1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe("POST /api/service-usage-history", () => {
    it("should create record with Vietnamese fields", async () => {
      const res = await request(app)
        .post("/api/service-usage-history")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaLSDV: "LSDV_TEST",
          SuDungDichVu: "su-1",
          TrangThaiCu: "Pending",
          TrangThaiMoi: "In Progress",
          TaiKhoan: "user-1",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaLSDV).toBe("LSDV_TEST");
      expect(res.body.data.TrangThaiCu).toBe("Pending");
      expect(res.body.data.TrangThaiMoi).toBe("In Progress");
      createdRecordId = res.body.data._id;
    });

    it("should return 409 for duplicate code", async () => {
      const res = await request(app)
        .post("/api/service-usage-history")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaLSDV: "LSDV_TEST",
          SuDungDichVu: "su-1",
          TrangThaiCu: "Pending",
          TrangThaiMoi: "In Progress",
        });
      expect(res.status).toBe(409);
    });

    it("should return 400 if missing required fields", async () => {
      const res = await request(app)
        .post("/api/service-usage-history")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ MaLSDV: "LSDV_INCOMPLETE" });
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/service-usage-history/:id — Status Shift Logic", () => {
    it("should shift status correctly (old newStatus → new oldStatus)", async () => {
      const res = await request(app)
        .put(`/api/service-usage-history/${createdRecordId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ TrangThaiMoi: "Completed" });

      expect(res.status).toBe(200);
      // Old TrangThaiMoi ("In Progress") should now be TrangThaiCu
      expect(res.body.data.TrangThaiCu).toBe("In Progress");
      expect(res.body.data.TrangThaiMoi).toBe("Completed");
    });

    it("should return 400 if TrangThaiMoi missing", async () => {
      const res = await request(app)
        .put(`/api/service-usage-history/${createdRecordId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/service-usage-history/:id", () => {
    it("should deny for Customer", async () => {
      const res = await request(app)
        .delete(`/api/service-usage-history/${createdRecordId}`)
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should delete as Admin", async () => {
      const res = await request(app)
        .delete(`/api/service-usage-history/${createdRecordId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
