import { type IUseCase } from "./IUseCase.js";
import { type Invoice, type InvoicePaymentStatus, type InvoiceDetail } from "../../models/Invoice.js";

export type InvoicePreview = {
  customerId?: string | undefined;
  customerName?: string | undefined;
  roomTotal: number;
  serviceTotal: number;
  deposit: number;
  rentalSlipId: string;
};

export type CreateInvoiceDetailUCInput = Omit<InvoiceDetail, "code">;

// Create (Manual)
export type CreateInvoiceUCInput = {
  rentalSlipId: string;
  cashierUserId: string;
  customerId?: string | undefined;
  paymentMethodId: string;
  roomTotal?: number | undefined;
  serviceTotal?: number | undefined;
  surcharge?: number | undefined;
  damageCharge?: number | undefined;
  deposit?: number | undefined;
  details?: CreateInvoiceDetailUCInput[] | undefined;
};
export type ICreateInvoiceUseCase = IUseCase<CreateInvoiceUCInput, Invoice>;

export type CreateCheckoutInvoiceUCInput = {
  rentalSlipId: string;
  cashierUserId: string; // Truyền User ID từ Token
  customerId?: string | undefined;
  paymentMethodId: string;
  roomTotal?: number | undefined;
  surcharge?: number | undefined;
  damageCharge?: number | undefined;
  deposit?: number | undefined;
};
export type ICreateCheckoutInvoiceUseCase = IUseCase<CreateCheckoutInvoiceUCInput, Invoice>;

// Get Preview
export type GetPreviewInvoiceUCInput = {
  rentalSlipId: string;
};
export type IGetPreviewInvoiceUseCase = IUseCase<GetPreviewInvoiceUCInput, InvoicePreview>;

// Get All
export type IGetAllInvoicesUseCase = IUseCase<{}, Invoice[]>;

// Get My (Customer)
export type GetCustomerInvoicesUCInput = { userId: string };
export type IGetCustomerInvoicesUseCase = IUseCase<GetCustomerInvoicesUCInput, Invoice[]>;

// Get By Id
export type GetInvoiceByIdUCInput = { id: string };
export type IGetInvoiceByIdUseCase = IUseCase<GetInvoiceByIdUCInput, Invoice>;

// Update
export type UpdateInvoiceUCInput = {
  id: string;
  paymentStatus?: InvoicePaymentStatus | undefined;
  // (In legacy code, full update was allowed, but usually just status is updated)
};
export type IUpdateInvoiceUseCase = IUseCase<UpdateInvoiceUCInput, Invoice>;

// Delete
export type DeleteInvoiceUCInput = { id: string };
export type IDeleteInvoiceUseCase = IUseCase<DeleteInvoiceUCInput, Invoice>;
