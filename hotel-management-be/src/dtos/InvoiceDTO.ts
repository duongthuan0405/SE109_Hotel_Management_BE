/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceBaseResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         error:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/InvoiceDataDTO'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvoiceDataDTO'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PreviewInvoiceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/PreviewInvoiceResponseDTO'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateInvoiceDetailDTO:


 *       type: object
 *       required:
 *         - TenHang
 *         - SoLuong
 *         - DonGia
 *         - ThanhTien
 *       properties:
 *         TenHang:
 *           type: string
 *         SoLuong:
 *           type: number
 *         DonGia:
 *           type: number
 *         ThanhTien:
 *           type: number
 *     CreateInvoiceRequestDTO:
 *       type: object
 *       required:
 *         - PhieuThuePhong
 *         - PhuongThucThanhToan
 *       properties:
 *         PhieuThuePhong:
 *           type: string
 *         KhachHang:
 *           type: string
 *         PhuongThucThanhToan:
 *           type: string
 *         TongTienPhong:
 *           type: number
 *         TongTienDichVu:
 *           type: number
 *         PhuThu:
 *           type: number
 *         TienBoiThuong:
 *           type: number
 *         TienDaCoc:
 *           type: number
 *         ChiTietHoaDon:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateInvoiceDetailDTO'
 */
export type CreateInvoiceDetailDTO = {
  TenHang: string;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceDetailDTO:
 *       type: object
 *       properties:
 *         MaCTHD:
 *           type: string
 *         TenHang:
 *           type: string
 *         SoLuong:
 *           type: number
 *         DonGia:
 *           type: number
 *         ThanhTien:
 *           type: number
 */
export type InvoiceDetailDTO = CreateInvoiceDetailDTO & {
  MaCTHD: string;
};

export type CreateInvoiceRequestDTO = {
  PhieuThuePhong: string;
  KhachHang?: string;
  PhuongThucThanhToan: string;
  TongTienPhong?: number;
  TongTienDichVu?: number;
  PhuThu?: number;
  TienBoiThuong?: number;
  TienDaCoc?: number;
  ChiTietHoaDon?: CreateInvoiceDetailDTO[];
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCheckoutInvoiceRequestDTO:
 *       type: object
 *       required:
 *         - PhieuThuePhong
 *         - PhuongThucThanhToan
 *       properties:
 *         PhieuThuePhong:
 *           type: string
 *         KhachHang:
 *           type: string
 *         PhuongThucThanhToan:
 *           type: string
 *         TongTienPhong:
 *           type: number
 *         PhuThu:
 *           type: number
 *         TienBoiThuong:
 *           type: number
 *         TienDaCoc:
 *           type: number
 */
export type CreateCheckoutInvoiceRequestDTO = {
  PhieuThuePhong: string;
  KhachHang?: string;
  PhuongThucThanhToan: string;
  TongTienPhong?: number;
  PhuThu?: number;
  TienBoiThuong?: number;
  TienDaCoc?: number;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaHD:
 *           type: string
 *         PhieuThuePhong:
 *           type: object
 *         NhanVienThuNgan:
 *           type: object
 *         KhachHang:
 *           type: object
 *         NgayLap:
 *           type: string
 *           format: date-time
 *         TongTienPhong:
 *           type: number
 *         TongTienDichVu:
 *           type: number
 *         PhuThu:
 *           type: number
 *         TienBoiThuong:
 *           type: number
 *         TienDaCoc:
 *           type: number
 *         TongThanhToan:
 *           type: number
 *         PhuongThucThanhToan:
 *           type: object
 *         TrangThaiThanhToan:
 *           type: string
 *         ChiTietHoaDon:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvoiceDetailDTO'
 */
export type InvoiceDataDTO = {
  _id: string;
  MaHD: string;
  PhieuThuePhong: any;
  NhanVienThuNgan: any;
  KhachHang: any;
  NgayLap: Date;
  TongTienPhong: number;
  TongTienDichVu: number;
  PhuThu: number;
  TienBoiThuong: number;
  TienDaCoc: number;
  TongThanhToan: number;
  PhuongThucThanhToan: any;
  TrangThaiThanhToan: string;
  ChiTietHoaDon: InvoiceDetailDTO[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     PreviewInvoiceResponseDTO:
 *       type: object
 *       properties:
 *         KhachHang:
 *           type: string
 *         HoTenKhachHang:
 *           type: string
 *         TongTienPhong:
 *           type: number
 *         TongTienDichVu:
 *           type: number
 *         TienDaCoc:
 *           type: number
 *         PhieuThuePhong:
 *           type: string
 */
export type PreviewInvoiceResponseDTO = {
  KhachHang?: string;
  HoTenKhachHang?: string;
  TongTienPhong: number;
  TongTienDichVu: number;
  TienDaCoc: number;
  PhieuThuePhong: string;
};
