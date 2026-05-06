import { type Notification } from "../../../models/Notification.js";
import { type INotificationRepository } from "../../types/INotificationRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (n: any): Notification => ({
  id: n.id,
  userId: n.userId,
  title: n.title,
  content: n.content,
  type: n.type as Notification["type"],
  isRead: n.isRead,
  createdAt: n.createdAt,
  updatedAt: n.updatedAt,
});

const notificationPrismaRepository: INotificationRepository = {
  findByUserId: async (userId: string): Promise<Notification[]> => {
    const records = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(mapToEntity);
  },

  findById: async (id: string): Promise<Notification | null> => {
    const record = await prisma.notification.findUnique({
      where: { id },
    });
    return record ? mapToEntity(record) : null;
  },

  create: async (data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> => {
    const newRecord = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        type: data.type,
        isRead: data.isRead,
      },
    });
    return mapToEntity(newRecord);
  },

  markAsRead: async (id: string, userId: string): Promise<Notification | null> => {
    const record = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!record) return null;

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return mapToEntity(updated);
  },
};

export default notificationPrismaRepository;
