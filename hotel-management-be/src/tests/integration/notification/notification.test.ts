import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../server.js";

describe("Notification API Integration Tests (Legacy Compatibility)", () => {
  let adminToken = "";
  let customerToken = "";

  beforeAll(async () => {
    // Login as Admin
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "admin",
      MatKhau: "123456",
    });
    adminToken = adminLoginRes.body.token;

    // Login as Customer
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      TenDangNhap: "customer1",
      MatKhau: "123456",
    });
    customerToken = customerLoginRes.body.token;
  });

  describe("GET /api/notifications", () => {
    it("should deny access without token", async () => {
      const res = await request(app).get("/api/notifications");
      expect(res.status).toBe(401);
    });

    it("should return notifications for customer with Vietnamese fields", async () => {
      const res = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);

      if (res.body.data.length > 0) {
        const first = res.body.data[0];
        expect(first._id).toBeDefined();
        expect(first.TieuDe).toBeDefined();
        expect(first.NoiDung).toBeDefined();
        expect(first.Loai).toBeDefined();
        expect(typeof first.DaDoc).toBe("boolean");
      }
    });

    it("should allow admin to get their notifications", async () => {
      const res = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it("should return notifications sorted by date descending", async () => {
      const res = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      if (res.body.data.length >= 2) {
        const date1 = new Date(res.body.data[0].NgayTao).getTime();
        const date2 = new Date(res.body.data[1].NgayTao).getTime();
        expect(date1).toBeGreaterThanOrEqual(date2);
      }
    });
  });

  describe("PUT /api/notifications/:id/read", () => {
    it("should deny access without token", async () => {
      const res = await request(app).put("/api/notifications/notif-1/read");
      expect(res.status).toBe(401);
    });

    it("should mark notification as read", async () => {
      const res = await request(app)
        .put("/api/notifications/notif-1/read")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.DaDoc).toBe(true);
    });

    it("should return 404 for non-existent notification", async () => {
      const res = await request(app)
        .put("/api/notifications/non-existent-id/read")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(404);
    });

    it("should return 404 when trying to read another user's notification", async () => {
      // Admin trying to read customer's notification
      const res = await request(app)
        .put("/api/notifications/notif-1/read")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("Notification created by guest maintenance request", () => {
    it("should create notification when guest submits maintenance request", async () => {
      // Get initial notification count
      const beforeRes = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${customerToken}`);
      const beforeCount = beforeRes.body.data.length;

      // Submit maintenance request
      await request(app)
        .post("/api/maintenance/guest/request")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          Phong: "room-1",
          NoiDung: "Vòi nước bị rỉ",
        });

      // Check notification count increased
      const afterRes = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${customerToken}`);
      
      expect(afterRes.body.data.length).toBeGreaterThan(beforeCount);

      // Check latest notification content
      const latestNotif = afterRes.body.data[0];
      expect(latestNotif.Loai).toBe("Maintenance");
      expect(latestNotif.TieuDe).toContain("bảo trì");
    });
  });
});
