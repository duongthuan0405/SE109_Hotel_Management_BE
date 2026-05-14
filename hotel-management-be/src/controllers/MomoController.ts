import { type Request, type Response, type NextFunction } from "express";
import { 
  createMomoSessionUseCase, 
  handleMomoIPNUseCase, 
  verifyMomoRedirectUseCase 
} from "../useCases/index.js";

const momoController = {
  createPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
         return res.status(401).json({ success: false, message: "Bạn cần đăng nhập để tiến hành thanh toán." });
      }

      const result = await createMomoSessionUseCase.execute({
        userId,
        roomClass: body.HangPhong,
        startDate: new Date(body.NgayDen),
        endDate: new Date(body.NgayDi),
        roomQuantity: body.SoLuongPhong,
        deposit: body.TienCoc,
        details: body.ChiTietDatPhong?.map((d: any) => ({ roomId: d.Phong })),
        frontendUrl: body.frontendUrl
      });

      res.status(200).json({
        success: true,
        message: "Khởi tạo thanh toán MoMo thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  verifyRedirect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await verifyMomoRedirectUseCase.execute({
         query: req.query
      });

      res.status(200).json({
        success: true,
        message: "Đã xác thực thanh toán MoMo",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  handleCallback: async (req: Request, res: Response) => {
    try {
      console.log("[MOMO CONTROLLER] Received callback IPN call from MoMo.");
      // Body contains parameters as defined in MoMo API
      await handleMomoIPNUseCase.execute({
        body: req.body
      });

      // MoMo specs require responding with HTTP 204 NO CONTENT or 200 to acknowledge receipt.
      res.status(204).send();
    } catch (err) {
      // Even if signature mismatch, usually standard is to respond status but you can respond bad request
      console.error("[MOMO CONTROLLER] IPN processing yielded errors:", err);
      res.status(400).json({ error: "Process error" });
    }
  }
};

export default momoController;
