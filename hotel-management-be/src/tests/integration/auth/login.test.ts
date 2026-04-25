import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Auth API Integration Tests - Login", () => {
  it("should return 400 if missing username or password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        TenDangNhap: "admin",
        // missing MatKhau
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Tên đăng nhập và mật khẩu là bắt buộc");
  });

  it("should return 401 for incorrect credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        TenDangNhap: "admin",
        MatKhau: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Tên đăng nhập hoặc mật khẩu không chính xác");
  });

  it("should return token and role admin for valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        TenDangNhap: "admin",
        MatKhau: "123456",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("VaiTro");
    expect(res.body.VaiTro).toBe("Admin");
  });

  it("should return token and role customer for valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        TenDangNhap: "customer1",
        MatKhau: "123456",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("VaiTro");
    expect(res.body.VaiTro).toBe("Customer");
  });
});
