import type { Notification } from "../../models/Notification.js";

export interface INotificationRepository {
  findByUserId(userId: string): Promise<Notification[]>;
  findById(id: string): Promise<Notification | null>;
  create(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification>;
  markAsRead(id: string, userId: string): Promise<Notification | null>;
}
