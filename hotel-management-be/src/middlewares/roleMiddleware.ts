import { type Request, type Response, type NextFunction } from "express";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = (req as any).user;
    if (!currentUser) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(currentUser.role)) {
      res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện hành động này" });
      return;
    }

    next();
  };
};
