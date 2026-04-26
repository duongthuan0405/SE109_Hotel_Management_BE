import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Room API Integration Tests", () => {
  let adminToken = "";
  let receptionistToken = "";
  let customerToken = "";
  let createdRoomId = "";

  beforeAll(async () => {
    // 1. Login as Default Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // 2. Create Receptionist via Admin API
    await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        TenDangNhap: "receptionist_test_room",
        MatKhau: "123456",
        VaiTro: "Receptionist",
      });
    const receptionistLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "receptionist_test_room",
      MatKhau: "123456",
    });
    receptionistToken = receptionistLoginRes.body.token;

    // 3. Register as Customer
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "customer_test_room",
      MatKhau: "123456",
    });
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer_test_room",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.token;
  });

  describe("GET /api/rooms", () => {
    it("should get all rooms without authentication", async () => {
      const res = await request(app).get("/api/rooms");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should get a specific room by id (using mocked id 'room-1')", async () => {
      const res = await request(app).get("/api/rooms/room-1");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaPhong).toBe("101");
    });

    it("should return 404 for non-existent room", async () => {
      const res = await request(app).get("/api/rooms/non-existent-id");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/rooms", () => {
    it("should deny creation if not authenticated", async () => {
      const res = await request(app).post("/api/rooms").send({
        MaPhong: "103",
        LoaiPhong: "1",
        GiaPhong: 600000,
        TrangThai: "Available",
      });
      expect(res.status).toBe(401);
    });

    it("should deny creation if authenticated as Customer", async () => {
      const res = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          MaPhong: "104",
          LoaiPhong: "1",
          GiaPhong: 600000,
          TrangThai: "Available",
        });
      expect(res.status).toBe(403);
    });

    it("should allow creation if authenticated as Admin", async () => {
      const res = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaPhong: "201",
          LoaiPhong: "2",
          GiaPhong: 1000000,
          TrangThai: "Available",
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaPhong).toBe("201");
      createdRoomId = res.body.data._id;
    });

    it("should deny creation if MaPhong already exists", async () => {
      const res = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaPhong: "201", // Duplicate
          LoaiPhong: "1",
          GiaPhong: 500000,
          TrangThai: "Available",
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Mã phòng đã tồn tại");
    });
  });

  describe("PUT /api/rooms/:id", () => {
    it("should allow updating room if authenticated as Admin", async () => {
      const res = await request(app)
        .put(`/api/rooms/${createdRoomId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          GiaPhong: 1100000,
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.GiaPhong).toBe(1100000);
    });

    it("should allow updating room if authenticated as Receptionist", async () => {
      const res = await request(app)
        .put(`/api/rooms/${createdRoomId}`)
        .set("Authorization", `Bearer ${receptionistToken}`)
        .send({
          TrangThai: "Maintenance",
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.TrangThai).toBe("Maintenance");
    });
  });

  describe("POST /api/rooms/:id/status", () => {
    it("should allow updating status if authenticated as Receptionist", async () => {
      const res = await request(app)
        .post(`/api/rooms/${createdRoomId}/status`)
        .set("Authorization", `Bearer ${receptionistToken}`)
        .send({
          status: "Available",
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.TrangThai).toBe("Available");
    });
  });

  describe("DELETE /api/rooms/:id", () => {
    it("should deny deletion if authenticated as Receptionist", async () => {
      const res = await request(app)
        .delete(`/api/rooms/${createdRoomId}`)
        .set("Authorization", `Bearer ${receptionistToken}`);
      expect(res.status).toBe(403);
    });

    it("should allow deletion if authenticated as Admin", async () => {
      const res = await request(app)
        .delete(`/api/rooms/${createdRoomId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
