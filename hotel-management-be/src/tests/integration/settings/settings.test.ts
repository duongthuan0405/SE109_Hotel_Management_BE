import { describe, it, expect, beforeAll } from "vitest";
import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "../../../server.js";

describe("Settings API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let customerToken = "";

  beforeAll(async () => {
    // Login as Admin
    const adminRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminRes.body.data.token;


    // Login as Customer
    const customerRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerRes.body.data.token;

  });

  describe("GET /api/settings", () => {
    it("should get default settings if not exists", async () => {
      const res = await request(app)
        .get("/api/settings")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.Key).toBe("GeneralSettings");
      expect(res.body.data.GiaPhongCoBan.Normal).toBe(400000); // Check default values
    });

    it("should deny customer to read settings", async () => {
      const res = await request(app)
        .get("/api/settings")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("PUT /api/settings", () => {
    it("should allow admin to update settings and sync room prices", async () => {
      const res = await request(app)
        .put("/api/settings")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          ThongTinKhachSan: {
            Ten: "Khách Sạn Mới",
          },
          GiaPhongCoBan: {
            Normal: 450000,
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ThongTinKhachSan.Ten).toBe("Khách Sạn Mới");
      expect(res.body.data.GiaPhongCoBan.Normal).toBe(450000);
    });

    it("should deny customer to update settings", async () => {
      const res = await request(app)
        .put("/api/settings")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          ThongTinKhachSan: {
            Ten: "Khách Sạn Hack",
          },
        });

      expect(res.status).toBe(403);
    });
  });
});
