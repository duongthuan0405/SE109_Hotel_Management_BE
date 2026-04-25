import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Account API Integration Tests", () => {
  let createdAccountId = "";

  it("should return 400 when creating an account without required fields", async () => {
    const res = await request(app).post("/api/accounts").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should create a new account successfully", async () => {
    const res = await request(app).post("/api/accounts").send({
      TenDangNhap: "testaccount",
      MatKhau: "123456",
      VaiTro: "Customer",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.username).toBe("testaccount");
    
    createdAccountId = res.body.data.id;
  });

  it("should return 409 when creating an account with existing username", async () => {
    const res = await request(app).post("/api/accounts").send({
      TenDangNhap: "testaccount",
      MatKhau: "123456",
      VaiTro: "Customer",
    });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should get all accounts successfully", async () => {
    const res = await request(app).get("/api/accounts");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should get account by ID successfully", async () => {
    const res = await request(app).get(`/api/accounts/${createdAccountId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdAccountId);
  });

  it("should update an account successfully", async () => {
    const res = await request(app).put(`/api/accounts/${createdAccountId}`).send({
      VaiTro: "Admin",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe("Admin");
  });

  it("should change password successfully", async () => {
    const res = await request(app).put(`/api/accounts/${createdAccountId}/change-password`).send({
      MatKhauCu: "123456",
      MatKhauMoi: "newpass123",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Thay đổi mật khẩu thành công");
  });

  it("should delete an account successfully", async () => {
    const res = await request(app).delete(`/api/accounts/${createdAccountId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Verify it's deleted
    const getRes = await request(app).get(`/api/accounts/${createdAccountId}`);
    expect(getRes.status).toBe(404);
  });
});
