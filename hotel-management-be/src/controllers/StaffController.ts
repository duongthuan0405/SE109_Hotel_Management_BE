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
  TaiKhoan: staff.user ? {
    _id: staff.user.id,
    TenDangNhap: staff.user.username,
    VaiTro: staff.user.role,
  } : staff.userId,
  MaNV: staff.code,
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
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }

  },

  updateMyProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const staff = await getStaffByUserIdUseCase.execute({ userId: currentUser.id });
      
      const body = req.body as UpdateStaffRequestDTO;
      const result = await updateStaffUseCase.execute({
        id: staff.id,
        fullName: body.HoTen,
        position: body.ChucVu,
        phone: body.SDT,
        email: body.Email,
      });
      
      const response: StaffResponseWrapper<StaffDataDTO> = {
        success: true,
        message: "Cập nhật hồ sơ cá nhân thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }

  },

  createStaff: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateStaffRequestDTO;
      const result = await createStaffUseCase.execute({
        userId: body.TaiKhoanId,
        fullName: body.HoTen,
        position: body.ChucVu,
        phone: body.SDT,
        email: body.Email,
      });
      const response: StaffResponseWrapper<StaffDataDTO> = {
        success: true,
        message: "Tạo hồ sơ nhân viên thành công",
        data: mapToDTO(result),
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }

  },

  updateStaff: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const body = req.body as UpdateStaffRequestDTO;
      const result = await updateStaffUseCase.execute({
        id,
        fullName: body.HoTen,
        position: body.ChucVu,
        phone: body.SDT,
        email: body.Email,
      });
      const response: StaffResponseWrapper<StaffDataDTO> = {
        success: true,
        message: "Cập nhật hồ sơ nhân viên thành công",
        data: mapToDTO(result),
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }

  },
};

export default staffController;
