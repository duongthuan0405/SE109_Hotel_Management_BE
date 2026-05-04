import { type Request, type Response, type NextFunction } from "express";
import {
  type PositionResponseWrapper,
  type PositionDataDTO,
  type CreatePositionRequestDTO,
  type UpdatePositionRequestDTO,
} from "../dtos/PositionDTO.js";
import {
  getAllPositionsUseCase,
  getPositionByIdUseCase,
  createPositionUseCase,
  updatePositionUseCase,
  deletePositionUseCase,
} from "../useCases/index.js";
import { type PositionUCOutput } from "../useCases/types/IPositionUseCases.js";

const mapToDTO = (position: PositionUCOutput): PositionDataDTO => ({
  _id: position.id,
  MaChucVu: position.code,
  TenChucVu: position.name,
});

const positionController = {
  // GET /api/positions
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllPositionsUseCase.execute();
      const response: PositionResponseWrapper<PositionDataDTO[]> = {
        success: true,
        message: "Lấy danh sách chức vụ thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: PositionResponseWrapper<undefined> = {
        success: false,
        message: "Lỗi khi lấy danh sách chức vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // GET /api/positions/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPositionByIdUseCase.execute(req.params.id as string);
      if (!result) {
        throw { status: 404, message: "Chức vụ không tồn tại" };
      }
      const response: PositionResponseWrapper<PositionDataDTO> = {
        success: true,
        message: "Lấy thông tin chức vụ thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: PositionResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin chức vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // POST /api/positions
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreatePositionRequestDTO;

      if (!body.TenChucVu) {
        throw { status: 400, message: "Vui lòng cung cấp tên chức vụ" };
      }

      const result = await createPositionUseCase.execute({
        name: body.TenChucVu,
      });

      const response: PositionResponseWrapper<PositionDataDTO> = {
        success: true,
        message: "Tạo chức vụ thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: PositionResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi tạo chức vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // PUT /api/positions/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdatePositionRequestDTO;

      if (!body.TenChucVu) {
        throw { status: 400, message: "Vui lòng cung cấp tên chức vụ" };
      }

      const result = await updatePositionUseCase.execute({
        id: req.params.id as string,
        name: body.TenChucVu,
      });

      if (!result) {
        throw { status: 404, message: "Chức vụ không tồn tại" };
      }

      const response: PositionResponseWrapper<PositionDataDTO> = {
        success: true,
        message: "Cập nhật chức vụ thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: PositionResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật chức vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  // DELETE /api/positions/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deletePositionUseCase.execute(req.params.id as string);
      const response: PositionResponseWrapper<undefined> = {
        success: true,
        message: "Xóa chức vụ thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: PositionResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi xóa chức vụ",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },
};

export default positionController;
