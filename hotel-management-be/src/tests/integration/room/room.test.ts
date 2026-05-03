import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Room API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let createdRoomId = "";

  beforeAll(async () => {
    // Login as Default Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.data.token;

  });

  describe("GET /api/rooms Compatibility", () => {
    it("should return list with Vietnamese fields and populated LoaiPhong", async () => {
      const res = await request(app).get("/api/rooms");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const firstRoom = res.body.data[0];
      expect(firstRoom._id).toBeDefined();
      expect(firstRoom.MaPhong).toBeDefined();
      expect(firstRoom.GiaPhong).toBeDefined();
      
      expect(typeof firstRoom.LoaiPhong).toBe("object");
      expect(firstRoom.LoaiPhong.MaLoaiPhong).toBeDefined();
    });

    it("should get specific room with legacy fields", async () => {
      const res = await request(app).get("/api/rooms/room-1");
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe("room-1");
      expect(res.body.data.MaPhong).toBe("101");
    });

    it("should return 404 for non-existent room", async () => {
      const res = await request(app).get("/api/rooms/non-existent-id");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/rooms Compatibility & Permissions", () => {
    it("should deny creation if not authenticated", async () => {
      const res = await request(app).post("/api/rooms").send({
        MaPhong: "103",
        LoaiPhong: "1",
        GiaPhong: 600000,
        TrangThai: "Available",
      });
      expect(res.status).toBe(401);
    });

    it("should allow creation if authenticated as Admin", async () => {
      const res = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaPhong: "ROOM_NEW_" + Date.now(),
          LoaiPhong: "1",
          GiaPhong: 800000,
          TrangThai: "Available",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.MaPhong).toBeDefined();
      createdRoomId = res.body.data._id;
    });
  });

  describe("PUT & STATUS Update Compatibility", () => {
    it("should allow updating room details as Admin", async () => {
      const res = await request(app)
        .put(`/api/rooms/${createdRoomId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          GiaPhong: 999999,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.GiaPhong).toBe(999999);
    });

    it("should update status and return Vietnamese fields", async () => {
      const res = await request(app)
        .post(`/api/rooms/${createdRoomId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "Occupied",
        });
      
      expect(res.status).toBe(200);
      expect(res.body.data.TrangThai).toBe("Occupied");
    });
  });

  describe("DELETE Room", () => {
    it("should allow admin to delete a room", async () => {
      const res = await request(app)
        .delete(`/api/rooms/${createdRoomId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
