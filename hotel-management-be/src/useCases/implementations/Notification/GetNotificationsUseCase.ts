import type { IGetNotificationsUseCase, NotificationUCOutput } from "../../types/INotificationUseCases.js";
import { notificationRepository } from "../../../repository/index.js";

const getNotificationsUseCase: IGetNotificationsUseCase = {
  execute: async (userId: string): Promise<NotificationUCOutput[]> => {
    return notificationRepository.findByUserId(userId);
  },
};

export default getNotificationsUseCase;
