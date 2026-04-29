import { type Request, type Response, type NextFunction } from "express";
import { type UpdateSettingsRequestDTO, type SettingsDataDTO } from "../dtos/SettingsDTO.js";
import { getSettingsUseCase, updateSettingsUseCase } from "../useCases/index.js";
import { type Settings } from "../models/Settings.js";

const mapToDTO = (s: Settings): SettingsDataDTO => ({
  _id: s.id,
  Key: s.key,
  ThongTinKhachSan: {
    Ten: s.hotelInfo.name,
    DiaChi: s.hotelInfo.address,
    SDT: s.hotelInfo.phone,
    Email: s.hotelInfo.email,
  },
  ThoiGian: {
    GioNhanPhong: s.timeConfig.checkInTime,
    GioTraPhong: s.timeConfig.checkOutTime,
  },
  ThuePhi: {
    ThueVAT: s.taxConfig.vatRate,
    PhiDichVu: s.taxConfig.serviceFeeRate,
  },
  GiaPhongCoBan: s.baseRoomPrices,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

const cleanObj = (obj: any) => {
  if (!obj) return undefined;
  const cleaned = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};

const settingsController = {
  getSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getSettingsUseCase.execute({});
      res.status(200).json({
        success: true,
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },

  updateSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateSettingsRequestDTO;

      // Map DTO (tiếng Việt) → UCInput (model)
      const result = await updateSettingsUseCase.execute({
        hotelInfo: cleanObj({
          name: body.ThongTinKhachSan?.Ten,
          address: body.ThongTinKhachSan?.DiaChi,
          phone: body.ThongTinKhachSan?.SDT,
          email: body.ThongTinKhachSan?.Email,
        }),
        timeConfig: cleanObj({
          checkInTime: body.ThoiGian?.GioNhanPhong,
          checkOutTime: body.ThoiGian?.GioTraPhong,
        }),
        taxConfig: cleanObj({
          vatRate: body.ThuePhi?.ThueVAT,
          serviceFeeRate: body.ThuePhi?.PhiDichVu,
        }),
        baseRoomPrices: cleanObj(body.GiaPhongCoBan),
      });

      res.status(200).json({
        success: true,
        data: mapToDTO(result),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default settingsController;
