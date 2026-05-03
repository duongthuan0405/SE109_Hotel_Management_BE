import type { Notification, NotificationType } from "../../models/Notification.js";
import type { IUseCase } from "./IUseCase.js";

export type NotificationUCOutput = Notification;

// Guest/Staff xem thông báo — nhận userId từ token
export type IGetNotificationsUseCase = IUseCase<string, NotificationUCOutput[]>;

// Đánh dấu đã đọc
export type MarkAsReadUCInput = {
  userId: string;
  notificationId: string;
};
export type IMarkNotificationAsReadUseCase = IUseCase<MarkAsReadUCInput, NotificationUCOutput | null>;

// Tạo thông báo (internal, gọi từ UC khác)
export type CreateNotificationUCInput = {
  userId: string;
  title: string;
  content: string;
  type: NotificationType;
};
export type ICreateNotificationUseCase = IUseCase<CreateNotificationUCInput, NotificationUCOutput>;
