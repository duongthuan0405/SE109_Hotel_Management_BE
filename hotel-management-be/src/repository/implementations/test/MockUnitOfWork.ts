import type { IUnitOfWork } from "../../types/IUnitOfWork.js";

const mockUnitOfWork: IUnitOfWork = {
  /**
   * Trong môi trường Mock, chỉ cần thực thi khối công việc ngay lập tức.
   */
  async runInTransaction<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    return await work(mockUnitOfWork);
  },
};

export default mockUnitOfWork;
