import crypto from "crypto";
import env from "../../config/env.js";
import { type IMomoService, type CreateMomoPaymentInput, type CreateMomoPaymentOutput } from "../types/IMomoService.js";

const momoService: IMomoService = {
  createPayment: async (input: CreateMomoPaymentInput): Promise<CreateMomoPaymentOutput> => {
    const requestId = input.orderId; // In many setups they are same or linked
    const orderId = input.orderId;
    const partnerCode = env.MOMO_PARTNER_CODE;
    const accessKey = env.MOMO_ACCESS_KEY;
    const secretKey = env.MOMO_SECRET_KEY;
    const requestType = "captureWallet"; // Direct capture to wallet
    const extraData = input.extraData || ""; 

    // 1. Formulate the raw sign string adhering precisely to MoMo strict spec sequence
    const rawSignature = `accessKey=${accessKey}&amount=${input.amount}&extraData=${extraData}&ipnUrl=${input.ipnUrl}&orderId=${orderId}&orderInfo=${input.orderInfo}&partnerCode=${partnerCode}&redirectUrl=${input.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // 2. Compute HMAC-SHA256 signature
    console.log("DEBUG MOMO - Raw Signature String:", rawSignature);
    console.log("DEBUG MOMO - Secret Key Used:", secretKey);

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");
    
    console.log("DEBUG MOMO - Computed Signature Hash:", signature);

    // 3. Construct final API payload body
    const payload = {
      partnerCode,
      partnerName: "Hotel Management",
      storeId: "MomoStore",
      requestType,
      ipnUrl: input.ipnUrl,
      redirectUrl: input.redirectUrl,
      orderId,
      amount: input.amount,
      lang: "vi",
      orderInfo: input.orderInfo,
      requestId,
      extraData,
      signature,
    };

    // 4. Execute POST call to MoMo Gateway using native fetch
    const response = await fetch(env.MOMO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to communicate with MoMo API Gateway: ${errText}`);
    }

    const responseData = (await response.json()) as CreateMomoPaymentOutput;

    if (responseData.resultCode !== 0) {
       throw new Error(`MoMo API Error (Code ${responseData.resultCode}): ${responseData.message}`);
    }

    return responseData;
  },

  verifySignature: (params: Record<string, any>, receivedSignature: string): boolean => {
    // Important: Verification string layout matches what MoMo dictates back for callback validation
    const accessKey = env.MOMO_ACCESS_KEY;
    const secretKey = env.MOMO_SECRET_KEY;
    
    // Map fields that arrive in callback payload
    const amount = params.amount;
    const extraData = params.extraData || "";
    const message = params.message || "";
    const orderId = params.orderId;
    const orderInfo = params.orderInfo;
    const orderType = params.orderType;
    const partnerCode = params.partnerCode;
    const payType = params.payType;
    const requestId = params.requestId;
    const responseTime = params.responseTime;
    const resultCode = params.resultCode;
    const transId = params.transId;

    // Spec definition for response validation signature string:
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const generatedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    return generatedSignature === receivedSignature;
  }
};

export default momoService;
