import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Staff API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let staffId = "";

  beforeAll(async () => {
    // Login as Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;
  });

  describe("Staff Profile & Compatibility", () => {
    it("should return staff list with Vietnamese fields and populated TaiKhoan", async () => {
      const res = await request(app)
        .get("/api/staffs")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const firstStaff = res.body.data[0];
      expect(firstStaff._id).toBeDefined();
      expect(firstStaff.MaNV).toBeDefined();
      expect(firstStaff.HoTen).toBeDefined();
      
      // Kiểm tra populate TaiKhoan
      expect(typeof firstStaff.TaiKhoan).toBe("object");
      expect(firstStaff.TaiKhoan.TenDangNhap).toBeDefined();
      
      staffId = firstStaff._id;
    });

    it("should get single staff with legacy fields", async () => {
      const res = await request(app)
        .get(`/api/staffs/${staffId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(staffId);
      expect(res.body.data.MaNV).toBeDefined();
    });

    it("should return 404 for non-existent staff", async () => {
      const res = await request(app)
        .get("/api/staffs/non-existent-id")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe("Staff Management Compatibility", () => {
    let newStaffId = "";
    let newAccountId = "";

    it("should allow admin to create staff and return populated object", async () => {
      const username = "staff_new_" + Date.now();
      const accountRes = await request(app)
        .post("/api/accounts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          TenDangNhap: username,
          MatKhau: "123456",
          VaiTro: "Receptionist"
        });
      
      newAccountId = accountRes.body.data._id;

      const res = await request(app)
        .post("/api/staffs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          TaiKhoanId: newAccountId,
          HoTen: "Nhân Viên Mới",
          ChucVu: "Receptionist",
          SDT: "0988888888",
          Email: `staff_${Date.now()}@hotel.com`
        });
      
      expect(res.status).toBe(201);
      expect(res.body.data.MaNV).toBeDefined();
      expect(res.body.data.TaiKhoan.TenDangNhap).toBe(username);
      newStaffId = res.body.data._id;
    });

    it("should allow admin to update staff profile", async () => {
      const res = await request(app)
        .put(`/api/staffs/${newStaffId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          HoTen: "Nhân Viên Updated",
          ChucVu: "Manager"
        });
      expect(res.status).toBe(200);
      expect(res.body.data.HoTen).toBe("Nhân Viên Updated");
    });

    it("should allow admin to delete staff", async () => {
      const res = await request(app)
        .delete(`/api/staffs/${newStaffId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
