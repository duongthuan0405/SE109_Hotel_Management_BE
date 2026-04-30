import { type Request, type Response, type NextFunction } from "express";
import {
  type NotificationResponseWrapper,
  type NotificationDataDTO,
} from "../dtos/NotificationDTO.js";
import {
  getNotificationsUseCase,
  markNotificationAsReadUseCase,
} from "../useCases/index.js";
import { type NotificationUCOutput } from "../useCases/types/INotificationUseCases.js";

const mapToDTO = (notification: NotificationUCOutput): NotificationDataDTO => ({
  _id: notification.id,
  KhachHang: notification.userId,
  TieuDe: notification.title,
  NoiDung: notification.content,
  Loai: notification.type,
  DaDoc: notification.isRead,
  NgayTao: notification.createdAt,
});

const notificationController = {
  // GET /api/notifications
  getNotifications: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await getNotificationsUseCase.execute(userId);
      const response: NotificationResponseWrapper<NotificationDataDTO[]> = {
        success: true,
        data: result.map(mapToDTO),
        message: "Lấy danh sách thông báo thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: NotificationResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông báo",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // PUT /api/notifications/:id/read
  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const notificationId = req.params.id as string;

      const result = await markNotificationAsReadUseCase.execute({
        userId,
        notificationId,
      });

      if (!result) {
        throw { status: 404, message: "Thông báo không tồn tại" };
      }

      const response: NotificationResponseWrapper<NotificationDataDTO> = {
        success: true,
        message: "Đã đánh dấu đã đọc",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: NotificationResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật thông báo",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },
};

export default notificationController;
