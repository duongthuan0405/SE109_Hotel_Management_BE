export type CreatePaymentMethodRequestDTO = {
  MaPTTT: string;
  TenPTTT: string;
};

export type UpdatePaymentMethodRequestDTO = {
  TenPTTT?: string;
};

export type PaymentMethodDataDTO = {
  _id: string;
  MaPTTT: string;
  TenPTTT: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};
