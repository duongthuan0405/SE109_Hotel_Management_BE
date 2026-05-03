import { AsyncLocalStorage } from "async_hooks";
import { Prisma } from "@prisma/client";

/**
 * AsyncLocalStorage cho phép chúng ta lưu trữ Prisma Transaction Client 
 * xuyên suốt các tác vụ không đồng bộ trong cùng một luồng thực thi.
 */
export const transactionStorage = new AsyncLocalStorage<Prisma.TransactionClient>();

/**
 * Hàm tiện ích để lấy Transaction Client hiện tại (nếu có).
 */
export const getTransactionClient = (): Prisma.TransactionClient | undefined => {
  return transactionStorage.getStore();
};
