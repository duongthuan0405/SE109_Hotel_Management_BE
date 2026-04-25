import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Auth API Integration Tests - Forgot Password", () => {
  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email là bắt buộc");
  });

  it("should return 404 if email does not exist", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({
      Email: "notfound@example.com",
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Không tìm thấy tài khoản với email này");
  });

  it("should generate OTP and return 200 for valid email", async () => {
    // First, register a user to ensure email exists
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "forgotuser",
      MatKhau: "123456",
      VaiTro: "Customer",
      Email: "forgotuser@example.com",
    });

    const res = await request(app).post("/api/auth/forgot-password").send({
      Email: "forgotuser@example.com",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("otp");
    expect(res.body.message).toContain("Email simulation");
  });
});
