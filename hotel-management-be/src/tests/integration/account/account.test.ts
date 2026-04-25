import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Account API Integration Tests (Self-Service)", () => {
  let token = "";

  it("should register, login and get token", async () => {
    // Register test user
    await request(app).post("/api/auth/register").send({
      TenDangNhap: "me_test",
      MatKhau: "123456",
      VaiTro: "Customer",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "me_test",
      MatKhau: "123456",
    });
    token = loginRes.body.token;
    expect(token).toBeDefined();
  });

  it("should get personal account info via GET /", async () => {
    const res = await request(app)
      .get("/api/accounts/me")
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe("me_test");
    expect(res.body.data.role).toBe("Customer");
  });

  it("should update personal profile info via PUT /", async () => {
    const res = await request(app)
      .put("/api/accounts/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        HoTen: "Nguyen Van Me",
        CMND: "0123456789",
        SDT: "0901234567",
        Email: "me@example.com",
        DiaChi: "123 Test St",
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toBe("Nguyen Van Me");
    expect(res.body.data.identityCard).toBe("0123456789");
    
    // Verify changes persisted
    const getRes = await request(app)
      .get("/api/accounts/me")
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.body.data.fullName).toBe("Nguyen Van Me");
  });

  it("should fail to change password with wrong old password", async () => {
    const res = await request(app)
      .put("/api/accounts/me/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        MatKhauCu: "wrongpass",
        MatKhauMoi: "newpass123",
      });
    
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should change personal password successfully via PUT /change-password", async () => {
    const res = await request(app)
      .put("/api/accounts/me/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        MatKhauCu: "123456",
        MatKhauMoi: "newpass123",
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Thay đổi mật khẩu thành công");

    // Verify can login with new password
    const loginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "me_test",
      MatKhau: "newpass123",
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
  });
});
