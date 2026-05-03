import type { ICreateNotificationUseCase, CreateNotificationUCInput, NotificationUCOutput } from "../../types/INotificationUseCases.js";
import { notificationRepository } from "../../../repository/index.js";

const createNotificationUseCase: ICreateNotificationUseCase = {
  execute: async (input: CreateNotificationUCInput): Promise<NotificationUCOutput> => {
    return notificationRepository.create({
      userId: input.userId,
      title: input.title,
      content: input.content,
      type: input.type,
      isRead: false,
    });
  },
};

export default createNotificationUseCase;
