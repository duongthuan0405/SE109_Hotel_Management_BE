export type NotificationType = 'Booking' | 'Service' | 'Maintenance' | 'Promotion' | 'General';

export type Notification = {
  id: string;
  userId: string;                  // TaiKhoan (ID) — dùng userId vì cả Customer lẫn Staff đều nhận thông báo
  title: string;                   // TieuDe
  content: string;                 // NoiDung
  type: NotificationType;          // Loai
  isRead: boolean;                 // DaDoc
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
