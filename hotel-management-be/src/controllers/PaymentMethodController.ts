import { type Request, type Response, type NextFunction } from "express";
import { type CreatePaymentMethodRequestDTO, type UpdatePaymentMethodRequestDTO, type PaymentMethodDataDTO } from "../dtos/PaymentMethodDTO.js";
import {
  createPaymentMethodUseCase,
  getAllPaymentMethodsUseCase,
  getPaymentMethodByIdUseCase,
  updatePaymentMethodUseCase,
  deletePaymentMethodUseCase,
} from "../useCases/index.js";
import { type PaymentMethod } from "../models/PaymentMethod.js";

const mapToDTO = (pm: PaymentMethod): PaymentMethodDataDTO => ({
  _id: pm.id,
  MaPTTT: pm.code,
  TenPTTT: pm.name,
  createdAt: pm.createdAt,
  updatedAt: pm.updatedAt,
});

const paymentMethodController = {
  getAllPaymentMethods: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllPaymentMethodsUseCase.execute({});
      res.status(200).json({
        success: true,
        message: "Lấy danh sách phương thức thanh toán thành công",
        data: result.map(mapToDTO),
      });
    } catch (error) {
      next(error);
    }
  },

  getPaymentMethodById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPaymentMethodByIdUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Lấy thông tin phương thức thanh toán thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  createPaymentMethod: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreatePaymentMethodRequestDTO;
      if (!body.TenPTTT) {
        res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp tên phương thức thanh toán",
        });
        return;
      }
      const result = await createPaymentMethodUseCase.execute({
        name: body.TenPTTT,
      });
      res.status(201).json({
        success: true,
        message: "Tạo phương thức thanh toán thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  updatePaymentMethod: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdatePaymentMethodRequestDTO;
      if (!body.TenPTTT) {
        res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp tên phương thức thanh toán",
        });
        return;
      }
      const result = await updatePaymentMethodUseCase.execute({
        id: req.params.id as string,
        name: body.TenPTTT,
      });
      res.status(200).json({
        success: true,
        message: "Cập nhật phương thức thanh toán thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  deletePaymentMethod: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deletePaymentMethodUseCase.execute({ id: req.params.id as string });
      res.status(200).json({
        success: true,
        message: "Xóa phương thức thanh toán thành công",
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default paymentMethodController;
