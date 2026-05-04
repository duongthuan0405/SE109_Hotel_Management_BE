import type { NotificationType } from "../models/Notification.js";

export type NotificationResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type NotificationDataDTO = {
  _id: string;
  KhachHang: string;       // userId (giữ tên legacy để client tương thích)
  TieuDe: string;
  NoiDung: string;
  Loai: NotificationType;
  DaDoc: boolean;
  NgayTao: Date | undefined;
};
