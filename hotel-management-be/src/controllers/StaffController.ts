import { type Request, type Response, type NextFunction } from "express";
import {
  getAllStaffsUseCase,
  getStaffByIdUseCase,
  getStaffByUserIdUseCase,
  createStaffUseCase,
  updateStaffUseCase,
  deleteStaffUseCase,
} from "../useCases/index.js";
import {
  type StaffDataDTO,
  type StaffResponseWrapper,
  type CreateStaffRequestDTO,
  type UpdateStaffRequestDTO,
} from "../dtos/StaffDTO.js";
import { type StaffUCOutput } from "../useCases/types/IStaffUseCases.js";

const mapToDTO = (staff: StaffUCOutput): StaffDataDTO => ({
  _id: staff.id,
  TaiKhoanId: staff.userId,
  MaNV: staff.staffId,
  HoTen: staff.fullName,
  ChucVu: staff.position,
  SDT: staff.phone,
  Email: staff.email,
});

const staffController = {
  getAllStaffs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllStaffsUseCase.execute();
      const response: StaffResponseWrapper<StaffDataDTO[]> = {
        success: true,
        message: "Lấy danh sách nhân viên thành công",
        data: result.map(mapToDTO),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: StaffResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy danh sách nhân viên",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  getMyProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const result = await getStaffByUserIdUseCase.execute({ userId: currentUser.id });
      const response: StaffResponseWrapper<StaffDataDTO> = {
        success: true,
        message: "Lấy hồ sơ cá nhân thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: StaffResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy hồ sơ cá nhân",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  updateMyProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const staff = await getStaffByUserIdUseCase.execute({ userId: currentUser.id });
      
      const body = req.body as UpdateStaffRequestDTO;
      const result = await updateStaffUseCase.execute({
        id: staff.id,
        ...body
      });
      
      const response: StaffResponseWrapper<StaffDataDTO> = {
        success: true,
        message: "Cập nhật hồ sơ cá nhân thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: StaffResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật hồ sơ cá nhân",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  getStaffById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await getStaffByIdUseCase.execute({ id });
      const response: StaffResponseWrapper<StaffDataDTO> = {
        success: true,
        message: "Lấy thông tin nhân viên thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: StaffResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin nhân viên",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  createStaff: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateStaffRequestDTO;
      const result = await createStaffUseCase.execute(body);
      const response: StaffResponseWrapper<StaffDataDTO> = {
        success: true,
        message: "Tạo hồ sơ nhân viên thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: StaffResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi tạo hồ sơ nhân viên",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  updateStaff: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const body = req.body as UpdateStaffRequestDTO;
      const result = await updateStaffUseCase.execute({
        id,
        ...body
      });
      const response: StaffResponseWrapper<StaffDataDTO> = {
        success: true,
        message: "Cập nhật hồ sơ nhân viên thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: StaffResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi cập nhật hồ sơ nhân viên",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },

  deleteStaff: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await deleteStaffUseCase.execute({ id });
      const response: StaffResponseWrapper<undefined> = {
        success: true,
        message: "Xóa hồ sơ nhân viên thành công",
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: StaffResponseWrapper<undefined> = {
        success: false,
        message: error.message || "Lỗi khi xóa hồ sơ nhân viên",
        error: error.message,
      };
      res.status(error.status || 500).json(response);
    }
  },
};

export default staffController;
