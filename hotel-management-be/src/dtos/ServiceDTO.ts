export type CreateServiceRequestDTO = {
  MaDV: string;
  TenDV: string;
  DonGia: number;
};

export type UpdateServiceRequestDTO = {
  TenDV?: string | undefined;
  DonGia?: number | undefined;
};

export type ServiceResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type ServiceResponseDTO = {
  _id: string;
  MaDV: string;
  TenDV: string;
  DonGia: number;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
