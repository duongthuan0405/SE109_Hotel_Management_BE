export type HotelInfo = {
  name: string; // Ten
  address: string; // DiaChi
  phone: string; // SDT
  email: string; // Email
};

export type TimeConfig = {
  checkInTime: string; // GioNhanPhong
  checkOutTime: string; // GioTraPhong
};

export type TaxConfig = {
  vatRate: number; // ThueVAT
  serviceFeeRate: number; // PhiDichVu
};

export type BaseRoomPrices = {
  Normal: number;
  Standard: number;
  Premium: number;
  Luxury: number;
};

export type Settings = {
  id: string;
  key: string; // Key
  hotelInfo: HotelInfo; // ThongTinKhachSan
  timeConfig: TimeConfig; // ThoiGian
  taxConfig: TaxConfig; // ThuePhi
  baseRoomPrices: BaseRoomPrices; // GiaPhongCoBan
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
