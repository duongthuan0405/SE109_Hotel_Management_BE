import { type INotificationRepository } from "../types/INotificationRepository.js";
import { type Notification } from "../../models/Notification.js";
import crypto from "crypto";

let notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-2", // customer1
    title: "Đặt phòng thành công",
    content: "Đơn đặt phòng DP001 của bạn đã được tạo. Vui lòng chờ xác nhận.",
    type: "Booking",
    isRead: false,
    createdAt: new Date("2026-04-28"),
    updatedAt: new Date("2026-04-28"),
  },
  {
    id: "notif-2",
    userId: "user-2", // customer1
    title: "Nhắc nhở nhận phòng",
    content: "Bạn có lịch nhận phòng vào ngày mai. Vui lòng đến đúng giờ.",
    type: "General",
    isRead: true,
    createdAt: new Date("2026-04-27"),
    updatedAt: new Date("2026-04-27"),
  },
];

const notificationRepository: INotificationRepository = {
  findByUserId: async (userId): Promise<Notification[]> => {
    const filtered = notifications.filter((n) => n.userId === userId);
    // Sort theo ngày tạo giảm dần
    return filtered.sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA;
    });
  },

  findById: async (id): Promise<Notification | null> => {
    return notifications.find((n) => n.id === id) || null;
  },

  create: async (data): Promise<Notification> => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    notifications.push(newNotification);
    return { ...newNotification };
  },

  markAsRead: async (id, userId): Promise<Notification | null> => {
    const index = notifications.findIndex((n) => n.id === id && n.userId === userId);
    if (index === -1) return null;

    const notification = notifications[index]!;
    notification.isRead = true;
    notification.updatedAt = new Date();
    return { ...notification };
  },
};

export default notificationRepository;
