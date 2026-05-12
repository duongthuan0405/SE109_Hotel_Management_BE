export type CreateMomoPaymentInput = {
  amount: number;
  orderId: string; // Typically your local DB id or a custom unique code
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  extraData?: string | undefined;
};

export type CreateMomoPaymentOutput = {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink?: string | undefined;
  qrCodeUrl?: string | undefined;
};

export type IMomoService = {
  createPayment: (input: CreateMomoPaymentInput) => Promise<CreateMomoPaymentOutput>;
  verifySignature: (params: Record<string, any>, receivedSignature: string) => boolean;
};
