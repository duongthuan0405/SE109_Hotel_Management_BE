import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Auth API Integration Tests - Register", () => {
  it("should return 400 if missing username, password, or role", async () => {
    const res = await request(app).post("/api/auth/register").send({
      TenDangNhap: "newuser",
      MatKhau: "password123",
      // Missing VaiTro
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Tên đăng nhập, mật khẩu và vai trò là bắt buộc");
  });

  it("should return 400 if password is less than 6 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({
      TenDangNhap: "newuser",
      MatKhau: "12345",
      VaiTro: "Customer",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Mật khẩu phải có ít nhất 6 ký tự");
  });

  it("should return 409 if user already exists", async () => {
    const res = await request(app).post("/api/auth/register").send({
      TenDangNhap: "admin",
      MatKhau: "password123",
      VaiTro: "Admin",
    });
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Tài khoản đã tồn tại");
  });

  it("should successfully register a new user and return 201", async () => {
    const res = await request(app).post("/api/auth/register").send({
      TenDangNhap: "newuser123",
      MatKhau: "password123",
      VaiTro: "Customer",
      HoTen: "New User",
      Email: "newuser@example.com",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.TenDangNhap).toBe("newuser123");
    expect(res.body.VaiTro).toBe("Customer");
  });
});
