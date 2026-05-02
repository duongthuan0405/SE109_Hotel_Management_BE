export type PositionResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type PositionDataDTO = {
  _id: string;
  MaChucVu: string;
  TenChucVu: string;
};

export type CreatePositionRequestDTO = {
  MaChucVu: string;
  TenChucVu: string;
};

export type UpdatePositionRequestDTO = {
  TenChucVu: string;
};
