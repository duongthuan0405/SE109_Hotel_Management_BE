import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Booking Overlap Logic Tests", () => {
  let adminToken = "";
  
  beforeAll(async () => {
    const adminLogin = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLogin.body.token;
  });

  it("should block booking if it overlaps exactly with an existing one", async () => {
    // 1. Tạo đơn đặt phòng đầu tiên (Phòng 101, từ ngày 10 đến ngày 15 tháng 10 năm 2026)
    await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách A", CMND: "A1", SDT: "01",
        HangPhong: "1",
        NgayDen: "2026-10-10",
        NgayDi: "2026-10-15",
        SoKhach: 1,
        ChiTietDatPhong: [{ MaCTDP: "CT-A", Phong: "room-1" }]
      });

    // 2. Thử đặt đúng ngày đó cho cùng phòng đó
    const res = await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách B", CMND: "B1", SDT: "02",
        HangPhong: "1",
        NgayDen: "2026-10-10",
        NgayDi: "2026-10-15",
        SoKhach: 1,
        ChiTietDatPhong: [{ MaCTDP: "CT-B", Phong: "room-1" }]
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("đã bị trùng lịch");
  });

  it("should block booking if it overlaps at the start", async () => {
    // Thử đặt từ ngày 08 đến ngày 12 (Trùng phần 10, 11, 12)
    const res = await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách C", CMND: "C1", SDT: "03",
        HangPhong: "1",
        NgayDen: "2026-10-08",
        NgayDi: "2026-10-12",
        SoKhach: 1,
        ChiTietDatPhong: [{ MaCTDP: "CT-C", Phong: "room-1" }]
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("đã bị trùng lịch");
  });

  it("should block booking if it overlaps at the end", async () => {
    // Thử đặt từ ngày 14 đến ngày 20 (Trùng ngày 14)
    const res = await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách D", CMND: "D1", SDT: "04",
        HangPhong: "1",
        NgayDen: "2026-10-14",
        NgayDi: "2026-10-20",
        SoKhach: 1,
        ChiTietDatPhong: [{ MaCTDP: "CT-D", Phong: "room-1" }]
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("đã bị trùng lịch");
  });

  it("should allow booking if dates are adjacent but not overlapping", async () => {
    // Khách A đi ngày 15. Khách E đến ngày 15 -> OK
    const res = await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách E", CMND: "E1", SDT: "05",
        HangPhong: "1",
        NgayDen: "2026-10-15",
        NgayDi: "2026-10-20",
        SoKhach: 1,
        ChiTietDatPhong: [{ MaCTDP: "CT-E", Phong: "room-1" }]
      });

    expect(res.status).toBe(201);
  });

  it("should automatically find another available room if the requested room type has multiple rooms", async () => {
    // Giả sử hạng phòng "1" có room-1 và room-2.
    // room-1 đã bị Khách A chiếm từ 10-15.
    // Khách F đặt từ 10-15 nhưng không chỉ định phòng -> Hệ thống phải gán room-2.
    const res = await request(app)
      .post("/api/bookings/walk-in")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        HoTen: "Khách F", CMND: "F1", SDT: "06",
        HangPhong: "1",
        NgayDen: "2026-10-10",
        NgayDi: "2026-10-15",
        SoKhach: 1,
        // Không gửi ChiTietDatPhong để hệ thống tự tìm
      });

    expect(res.status).toBe(201);
    expect(res.body.ChiTietDatPhong[0].Phong._id).toBe("room-2");
  });
});
