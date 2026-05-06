import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Booking Overlap Logic Tests", () => {
  let adminToken = "";
  
  beforeAll(async () => {
    // Login as Admin (Hồ sơ staff-1 đã có sẵn trong SEED data)
    const adminLogin = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLogin.body.data.token;

  });

  it("should block booking if it overlaps exactly with an existing one", async () => {
    // 1. Tạo đơn đặt phòng đầu tiên (Phòng room-1, từ ngày 10 đến ngày 15 tháng 10 năm 2026)
    await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách A", CMND: "A1", SDT: "01",
        HangPhong: "1",
        NgayDen: "2026-10-10",
        NgayDi: "2026-10-15",
        ChiTietDatPhong: [{ MaCTDP: "CT-A", Phong: "room-1" }]
      });

    // 2. Thử đặt đúng ngày đó cho cùng phòng đó -> Phải chặn
    const res = await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách B", CMND: "B1", SDT: "02",
        HangPhong: "1",
        NgayDen: "2026-10-10",
        NgayDi: "2026-10-15",
        ChiTietDatPhong: [{ MaCTDP: "CT-B", Phong: "room-1" }]
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("đã bị trùng lịch");
  });

  it("should allow booking if dates are adjacent but not overlapping", async () => {
    // Khách cũ đi ngày 15. Khách mới đến ngày 15 -> OK
    const res = await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách E", CMND: "E1", SDT: "05",
        HangPhong: "1",
        NgayDen: "2026-10-15",
        NgayDi: "2026-10-20",
        ChiTietDatPhong: [{ MaCTDP: "CT-E", Phong: "room-1" }]
      });

    expect(res.status).toBe(201);
  });
});
