import { transactionStorage } from "../../../config/transaction-context.js";
import prismaProxy from "../../../config/prisma.js";
import type { IUnitOfWork } from "../../types/IUnitOfWork.js";

const unitOfWork: IUnitOfWork = {
  /**
   * Chạy một khối công việc trong một database transaction.
   * Cơ chế: Sử dụng Prisma $transaction và AsyncLocalStorage để truyền 'tx' client ngầm định.
   */
  async runInTransaction<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    // Kiểm tra xem đã có transaction nào đang chạy chưa
    const existingTx = transactionStorage.getStore();
    if (existingTx) {
      return await work(unitOfWork);
    }

    // Nếu chưa có, mở transaction mới
    return await prismaProxy.$transaction(async (tx) => {
      // Chạy khối 'work' bên trong context của 'tx' client
      return await transactionStorage.run(tx, async () => {
        return await work(unitOfWork);
      });
    });
  },
};

export default unitOfWork;
