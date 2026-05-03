import type { IMarkNotificationAsReadUseCase, MarkAsReadUCInput, NotificationUCOutput } from "../../types/INotificationUseCases.js";
import { notificationRepository } from "../../../repository/index.js";

const markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase = {
  execute: async (input: MarkAsReadUCInput): Promise<NotificationUCOutput | null> => {
    const result = await notificationRepository.markAsRead(input.notificationId, input.userId);
    if (!result) {
      throw { status: 404, message: "Thông báo không tồn tại" };
    }
    return result;
  },
};

export default markNotificationAsReadUseCase;
