/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePaymentMethodRequestDTO:
 *       type: object
 *       required:
 *         - TenPTTT
 *       properties:
 *         TenPTTT:
 *           type: string
 */
export type CreatePaymentMethodRequestDTO = {
  TenPTTT: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePaymentMethodRequestDTO:
 *       type: object
 *       properties:
 *         TenPTTT:
 *           type: string
 */
export type UpdatePaymentMethodRequestDTO = {
  TenPTTT?: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentMethodDataDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         MaPTTT:
 *           type: string
 *         TenPTTT:
 *           type: string
 */
export type PaymentMethodDataDTO = {
  _id: string;
  MaPTTT: string;
  TenPTTT: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};
