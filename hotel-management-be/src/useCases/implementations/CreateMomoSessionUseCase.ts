import customerCreateBookingUseCase from "./CustomerCreateBookingUseCase.js";
import { momoService } from "../../services/index.js";
import { roomTypeRepository } from "../../repository/index.js";
import { type ICreateMomoSessionUseCase, type CreateMomoSessionUCInput, type CreateMomoSessionUCOutput } from "../types/IMomoUseCases.js";
import env from "../../config/env.js";

const createMomoSessionUseCase: ICreateMomoSessionUseCase = {
  execute: async (input: CreateMomoSessionUCInput): Promise<CreateMomoSessionUCOutput> => {
    // 1. Create generic pending Booking
    const booking = await customerCreateBookingUseCase.execute({
      userId: input.userId,
      roomClass: input.roomClass,
      startDate: input.startDate,
      endDate: input.endDate,
      roomQuantity: input.roomQuantity || 1,
      deposit: input.deposit || 0,
      details: input.details,
    });

    const roomType = await roomTypeRepository.findById(booking.roomClass);
    const roomName = roomType?.name || "Phòng khách sạn";

    // Construct links
    const frontendUrl = input.frontendUrl || env.FRONTEND_URL;
    const backendUrl = env.BACKEND_URL; // Crucial for IPN (Instant Payment Notification Callback from Momo)

    const redirectUrl = `${frontendUrl}/customer/booking/success`; // Frontend receives query params from Momo automatically
    const ipnUrl = `${backendUrl}/api/momo/callback`; // Webhook endpoint that MUST handle standard callback logic

    // Momo Order ID usually linked via string
    // Ensure unique ID by combining timestamp or using booking code
    const orderId = `${booking.code}-${Date.now()}`; 

    // 2. Send payload to MoMo API
    const result = await momoService.createPayment({
      amount: booking.deposit || 0,
      orderId: orderId,
      orderInfo: `Pay for booking ${booking.code}`, // Using simple ASCII to eliminate any potential charset encoding divergence
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: booking.id // Use direct simple string to avoid JSON escape divergence in signature calculation
    });

    return {
      payUrl: result.payUrl,
      orderId: result.orderId,
      bookingId: booking.id,
      message: result.message
    };
  },
};

export default createMomoSessionUseCase;
