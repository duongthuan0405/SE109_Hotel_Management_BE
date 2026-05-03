import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Auth API Integration Tests - Register", () => {
  it("should return 400 if missing username or password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      TenDangNhap: "newuser",
      // Missing MatKhau
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Tên đăng nhập và mật khẩu là bắt buộc");
  });

  it("should return 400 if password is less than 6 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({
      TenDangNhap: "newuser",
      MatKhau: "12345",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Mật khẩu phải có ít nhất 6 ký tự");
  });

  it("should return 409 if user already exists", async () => {
    const res = await request(app).post("/api/auth/register").send({
      TenDangNhap: "admin",
      MatKhau: "password123",
    });
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Tài khoản đã tồn tại");
  });

  it("should successfully register a new user as Customer and ignore provided VaiTro", async () => {
    const res = await request(app).post("/api/auth/register").send({
      TenDangNhap: "newuser123_reg",
      MatKhau: "password123",
      VaiTro: "Admin", // Should be ignored
      HoTen: "New User",
      Email: "newuser@example.com",
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.TenDangNhap).toBe("newuser123_reg");
    expect(res.body.data.VaiTro).toBe("Customer"); // Must be Customer

  });
});
