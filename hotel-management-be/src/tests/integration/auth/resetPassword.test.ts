import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Auth API Integration Tests - Reset Password", () => {
  it("should return 400 if missing fields", async () => {
    const res = await request(app).post("/api/auth/reset-password-otp").send({
      Email: "some@example.com",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email, OTP và Mật khẩu mới là bắt buộc");
  });

  it("should return 404 if account not found", async () => {
    const res = await request(app).post("/api/auth/reset-password-otp").send({
      Email: "missing@example.com",
      OTP: "123456",
      MatKhau: "newpassword",
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Tài khoản không tồn tại");
  });

  it("should return 400 if password is too short", async () => {
    const res = await request(app).post("/api/auth/reset-password-otp").send({
      Email: "test@example.com",
      OTP: "123456",
      MatKhau: "123",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Mật khẩu mới phải có ít nhất 6 ký tự");
  });

  it("should reset password successfully with valid OTP", async () => {
    // 1. Register a user
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "resetuser",
      MatKhau: "123456",
      VaiTro: "Customer",
      Email: "resetuser@example.com",
    });

    // 2. Request forgot password to get OTP
    const forgotRes = await request(app).post("/api/auth/forgot-password").send({
      Email: "resetuser@example.com",
    });
    const otp = forgotRes.body.otp;

    // 3. Reset password
    const res = await request(app).post("/api/auth/reset-password-otp").send({
      Email: "resetuser@example.com",
      OTP: otp,
      MatKhau: "newpassword123",
    });
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Mật khẩu đã được đặt lại thành công");

    // 4. Verify login with new password
    const loginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "resetuser",
      MatKhau: "newpassword123",
    });
    expect(loginRes.status).toBe(200);
  });
});
