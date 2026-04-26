import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("RoomType API Integration Tests", () => {
  let adminToken = "";
  let customerToken = "";
  let createdRoomTypeId = "";

  beforeAll(async () => {
    // 1. Register & Login as Admin
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "admin_roomtype",
      MatKhau: "123456",
      VaiTro: "Admin",
    });
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin_roomtype",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // 2. Register & Login as Customer
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "customer_roomtype",
      MatKhau: "123456",
      VaiTro: "Customer",
    });
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer_roomtype",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.token;
  });

  describe("Public Endpoints (GET)", () => {
    it("should get all room types without authentication", async () => {
      const res = await request(app).get("/api/room-types");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should get a specific room type by id (using mocked id '1')", async () => {
      const res = await request(app).get("/api/room-types/1");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe("STD");
    });

    it("should return 404 for non-existent room type", async () => {
      const res = await request(app).get("/api/room-types/999");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Protected Endpoints (POST, PUT, DELETE)", () => {
    it("should deny creation if not authenticated", async () => {
      const res = await request(app).post("/api/room-types").send({
        MaLoaiPhong: "NEW1",
        TenLoaiPhong: "Phòng Mới 1",
      });
      expect(res.status).toBe(401);
    });

    it("should deny creation if authenticated as Customer", async () => {
      const res = await request(app)
        .post("/api/room-types")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          MaLoaiPhong: "NEW2",
          TenLoaiPhong: "Phòng Mới 2",
        });
      expect(res.status).toBe(403);
    });

    it("should allow creation if authenticated as Admin", async () => {
      const res = await request(app)
        .post("/api/room-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaLoaiPhong: "SUI",
          TenLoaiPhong: "Phòng Suite",
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe("SUI");
      expect(res.body.data.name).toBe("Phòng Suite");
      
      createdRoomTypeId = res.body.data.id;
    });

    it("should deny creation if code already exists", async () => {
      const res = await request(app)
        .post("/api/room-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaLoaiPhong: "SUI", // Duplicate code
          TenLoaiPhong: "Phòng Suite 2",
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should allow updating room type if authenticated as Admin", async () => {
      const res = await request(app)
        .put(`/api/room-types/${createdRoomTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaLoaiPhong: "SUI-PRO",
          TenLoaiPhong: "Phòng Suite Pro",
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe("SUI-PRO");
      expect(res.body.data.name).toBe("Phòng Suite Pro");
    });

    it("should deny deletion if authenticated as Customer", async () => {
      const res = await request(app)
        .delete(`/api/room-types/${createdRoomTypeId}`)
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it("should allow deletion if authenticated as Admin", async () => {
      const res = await request(app)
        .delete(`/api/room-types/${createdRoomTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 when deleting already deleted room type", async () => {
      const res = await request(app)
        .delete(`/api/room-types/${createdRoomTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });
});
