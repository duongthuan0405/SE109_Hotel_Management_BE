/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateSettingsRequestDTO:
 *       type: object
 *       properties:
 *         ThongTinKhachSan:
 *           type: object
 *           properties:
 *             Ten:
 *               type: string
 *             DiaChi:
 *               type: string
 *             SDT:
 *               type: string
 *             Email:
 *               type: string
 *         ThoiGian:
 *           type: object
 *           properties:
 *             GioNhanPhong:
 *               type: string
 *             GioTraPhong:
 *               type: string
 *         ThuePhi:
 *           type: object
 *           properties:
 *             ThueVAT:
 *               type: number
 *             PhiDichVu:
 *               type: number
 *         GiaPhongCoBan:
 *           type: object
 *           properties:
 *             Normal:
 *               type: number
 *             Standard:
 *               type: number
 *             Premium:
 *               type: number
 *             Luxury:
 *               type: number
 */
export type UpdateSettingsRequestDTO = {
  ThongTinKhachSan?: {
    Ten?: string;
    DiaChi?: string;
    SDT?: string;
    Email?: string;
  };
  ThoiGian?: {
    GioNhanPhong?: string;
    GioTraPhong?: string;
  };
  ThuePhi?: {
    ThueVAT?: number;
    PhiDichVu?: number;
  };
  GiaPhongCoBan?: {
    Normal?: number;
    Standard?: number;
    Premium?: number;
    Luxury?: number;
  };
};

// Response DTO
/**
 * @swagger
 * components:
 *   schemas:
 *     SettingsDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         Key:
 *           type: string
 *         ThongTinKhachSan:
 *           type: object
 *         ThoiGian:
 *           type: object
 *         ThuePhi:
 *           type: object
 *         GiaPhongCoBan:
 *           type: object
 */
export type SettingsDataDTO = {
  _id: string;
  Key: string;
  ThongTinKhachSan: {
    Ten: string;
    DiaChi: string;
    SDT: string;
    Email: string;
  };
  ThoiGian: {
    GioNhanPhong: string;
    GioTraPhong: string;
  };
  ThuePhi: {
    ThueVAT: number;
    PhiDichVu: number;
  };
  GiaPhongCoBan: {
    Normal: number;
    Standard: number;
    Premium: number;
    Luxury: number;
  };
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};
