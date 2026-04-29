import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Staff API Integration Tests", () => {
  let adminToken = "";
  // ID chuẩn của Admin Staff từ SEED data
  const SEED_STAFF_ID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

  beforeAll(async () => {
    // Login as Admin
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminRes.body.token;
  });

  describe("Staff Profile Access", () => {
    it("should return personal profile via /api/staffs/me", async () => {
      const res = await request(app)
        .get("/api/staffs/me")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(SEED_STAFF_ID);
      expect(res.body.data.HoTen).toBe("Admin Staff");
      expect(res.body.data.MaNV).toBe("NV001");
    });
  });

  describe("Admin Management", () => {
    it("should allow admin to list all staffs", async () => {
      const res = await request(app)
        .get("/api/staffs")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((s: any) => s._id === SEED_STAFF_ID)).toBe(true);
    });

    it("should allow admin to create a new staff (requires a new User first)", async () => {
      // Trong thực tế, phải tạo User trước, sau đó mới tạo Staff gắn với User đó
      // Nhưng ở đây ta test quyền hạn và logic cơ bản
      const res = await request(app)
        .post("/api/staffs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          MaNV: "NV002",
          HoTen: "New Receptionist",
          ChucVu: "Receptionist",
          SDT: "0111222333",
          Email: "recep@test.com",
          TaiKhoanId: "new-user-id" // Đã sửa từ TaiKhoan sang TaiKhoanId
        });

      expect(res.status).toBe(201);
      expect(res.body.data.MaNV).toBe("NV002");
    });
  });
});
