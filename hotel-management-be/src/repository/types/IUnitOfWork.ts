export type IUnitOfWork = {
  /**
   * Chạy một khối công việc trong một database transaction.
   * Vì đã có cơ chế Proxy và Context ngầm định, các Repository tự import 
   * sẽ tự động tham gia vào transaction này.
   */
  runInTransaction<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
