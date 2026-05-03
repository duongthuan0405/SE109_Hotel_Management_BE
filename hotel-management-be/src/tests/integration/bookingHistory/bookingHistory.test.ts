import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";
import { bookingHistoryRepository } from "../../../repository/index.js";

describe("Booking History API", () => {
  let mockToken = "";
  let historyId = "";
  let bookingId = "b123";

  beforeAll(async () => {
    // Login as Admin to get a valid token
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    mockToken = adminRes.body.data.token;


    // Xóa dữ liệu cũ nếu có (ở môi trường mock, có thể bỏ qua hoặc clear mock array)
    // Tạo 1 history mẫu
    const created = await bookingHistoryRepository.create({
      code: "LSDP000",
      bookingId: bookingId,
      oldStatus: "Pending",
      newStatus: "Confirmed",
    });
    historyId = created.id;
  });

/*
  describe("POST /api/booking-history", () => {
    it("should create a new booking history", async () => {
      const res = await request(app)
        .post("/api/booking-history")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          MaLSDP: "LSDP001",
          DatPhong: bookingId,
          TrangThaiCu: "Pending",
          TrangThaiMoi: "CheckedIn",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaLSDP).toBe("LSDP001");
    });

    it("should return 409 if code exists", async () => {
      const res = await request(app)
        .post("/api/booking-history")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          MaLSDP: "LSDP001",
          DatPhong: bookingId,
          TrangThaiCu: "CheckedIn",
          TrangThaiMoi: "CheckedOut",
        });

      expect(res.status).toBe(409);
    });
  });
*/

  describe("GET /api/booking-history", () => {
    it("should get all booking histories", async () => {
      const res = await request(app)
        .get("/api/booking-history")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/booking-history/:id", () => {
    it("should get booking history by id", async () => {
      const res = await request(app)
        .get(`/api/booking-history/${historyId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.MaLSDP).toBe("LSDP000");
    });

    it("should return 404 for invalid id", async () => {
      const res = await request(app)
        .get("/api/booking-history/invalid-id")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/booking-history/booking/:bookingId", () => {
    it("should get history by booking id", async () => {
      const res = await request(app)
        .get(`/api/booking-history/booking/${bookingId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("DELETE /api/booking-history/:id", () => {
    it("should delete booking history", async () => {
      const res = await request(app)
        .delete(`/api/booking-history/${historyId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for already deleted id", async () => {
      const res = await request(app)
        .delete(`/api/booking-history/${historyId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });
  });
});
