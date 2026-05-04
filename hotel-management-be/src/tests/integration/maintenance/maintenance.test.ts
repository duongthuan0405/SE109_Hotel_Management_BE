import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Maintenance API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let customerToken = "";
  let createdMaintenanceId = "";

  beforeAll(async () => {
    // Login as Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.data.token;

    // Login as Customer
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.data.token;
  });

  describe("GET /api/maintenance Compatibility", () => {
    it("should return list with Vietnamese fields and populated objects", async () => {
      const res = await request(app)
        .get("/api/maintenance")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);

      if (res.body.data.length > 0) {
        const first = res.body.data[0];
        expect(first._id).toBeDefined();
        expect(first.MaPBT).toBeDefined();
        expect(first.NoiDung).toBeDefined();
        expect(first.TrangThai).toBeDefined();
        expect(first.NgayThucHien).toBeDefined();
        expect(first.NgayKetThuc).toBeDefined();
      }
    });

    it("should deny access without token", async () => {
      const res = await request(app).get("/api/maintenance");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/maintenance/:id Compatibility", () => {
    it("should get specific record with Vietnamese fields", async () => {
      const res = await request(app)
        .get("/api/maintenance/maint-1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe("maint-1");
      expect(res.body.data.MaPBT).toBe("PBT001");
      expect(res.body.data.NoiDung).toBeDefined();
    });

    it("should return 404 for non-existent record", async () => {
      const res = await request(app)
        .get("/api/maintenance/non-existent-id")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/maintenance/next-code", () => {
    it("should return next PBT code", async () => {
      const res = await request(app)
        .get("/api/maintenance/next-code")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.nextCode).toMatch(/^PBT\d{3}$/);
    });
  });

  describe("POST /api/maintenance Compatibility & Permissions", () => {
    it("should deny creation without authentication", async () => {
      const res = await request(app).post("/api/maintenance").send({
        MaPBT: "PBT100",
        Phong: "room-3",
        NVKyThuat: "staff-1",
        NgayThucHien: "2026-06-01",
        NgayKetThuc: "2026-06-02",
        NoiDung: "Test bảo trì",
      });
      expect(res.status).toBe(401);
    });

    it("should deny creation for Customer role", async () => {
      const res = await request(app)
        .post("/api/maintenance")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          MaPBT: "PBT100",
          Phong: "room-3",
          NVKyThuat: "staff-1",
          NgayThucHien: "2026-06-01",
          NgayKetThuc: "2026-06-02",
          NoiDung: "Test bảo trì",
        });
      expect(res.status).toBe(403);
    });

    it("should allow creation as Admin with Vietnamese fields", async () => {
      const res = await request(app)
        .post("/api/maintenance")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaPBT: "PBT_TEST_" + Date.now(),
          Phong: "room-3",
          NVKyThuat: "staff-1",
          NgayThucHien: "2026-06-01",
          NgayKetThuc: "2026-06-02",
          NoiDung: "Sửa vòi nước phòng 103",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaPBT).toBeDefined();
      expect(res.body.data.NoiDung).toBe("Sửa vòi nước phòng 103");
      expect(res.body.data.TrangThai).toBe("Pending");
      createdMaintenanceId = res.body.data._id;
    });

    it("should return 400 if missing required fields", async () => {
      const res = await request(app)
        .post("/api/maintenance")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaPBT: "PBT_INCOMPLETE",
        });
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/maintenance/:id Compatibility", () => {
    it("should allow updating maintenance record", async () => {
      const res = await request(app)
        .put(`/api/maintenance/${createdMaintenanceId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          NoiDung: "Nội dung đã cập nhật",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.NoiDung).toBe("Nội dung đã cập nhật");
    });

    it("should update status to Completed", async () => {
      const res = await request(app)
        .put(`/api/maintenance/${createdMaintenanceId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          TrangThai: "Completed",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.TrangThai).toBe("Completed");
    });

    it("should return 404 for non-existent record", async () => {
      const res = await request(app)
        .put("/api/maintenance/non-existent-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ NoiDung: "Test" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/maintenance/:id", () => {
    it("should deny delete for Customer role", async () => {
      const res = await request(app)
        .delete(`/api/maintenance/${createdMaintenanceId}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });

    it("should allow admin to delete a record", async () => {
      const res = await request(app)
        .delete(`/api/maintenance/${createdMaintenanceId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("Guest Routes", () => {
    it("should deny guest routes for Admin role", async () => {
      const res = await request(app)
        .get("/api/maintenance/guest/requests")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(403);
    });

    it("should allow customer to create maintenance request", async () => {
      const res = await request(app)
        .post("/api/maintenance/guest/request")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          Phong: "room-1",
          NoiDung: "Điều hòa không mát",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaPBT).toMatch(/^PBT\d{3}$/);
      expect(res.body.data.NoiDung).toBe("Điều hòa không mát");
      expect(res.body.data.TrangThai).toBe("Pending");
    });

    it("should allow customer to get their requests", async () => {
      const res = await request(app)
        .get("/api/maintenance/guest/requests")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should return 400 if guest missing required fields", async () => {
      const res = await request(app)
        .post("/api/maintenance/guest/request")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });
});
