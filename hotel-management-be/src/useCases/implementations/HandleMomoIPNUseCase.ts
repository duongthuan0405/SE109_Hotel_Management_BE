import { bookingRepository, roomRepository, unitOfWork } from "../../repository/index.js";
import { momoService } from "../../services/index.js";
import { type IHandleMomoIPNUseCase, type HandleMomoIPNUCInput } from "../types/IMomoUseCases.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";

const handleMomoIPNUseCase: IHandleMomoIPNUseCase = {
  execute: async (input: HandleMomoIPNUCInput): Promise<void> => {
    const body = input.body;
    const signature = body.signature as string;

    // 1. Cryptographically verify the event is authenticated by MoMo
    const isValid = momoService.verifySignature(body, signature);
    if (!isValid) {
      console.error("[MOMO IPN] Discarding callback due to invalid signature verify.");
      throw { status: 400, message: "Invalid signature" };
    }

    const resultCode = Number(body.resultCode);
    if (resultCode !== 0) {
      // Payment didn't succeed (user cancelled, or failed)
      console.log(`[MOMO IPN] Payment was not successful (Result: ${resultCode}). No actions taken.`);
      return;
    }

    // Extract our tracked internal DB ID from simpler extraData string
    const bookingId = body.extraData;

    if (!bookingId) {
      console.error("[MOMO IPN] No reference bookingId passed in extraData.");
      return;
    }

    // 2. Run state mutation in critical transaction
    await unitOfWork.runInTransaction(async () => {
      const booking = await bookingRepository.findById(bookingId, { rooms: true });
      
      if (!booking) {
        console.warn(`[MOMO IPN] Booking not found: ${bookingId}`);
        return;
      }

      // Skip if already fully committed (avoids double-lock side effects)
      if (booking.status === "Confirmed" || booking.status === "CheckedIn") {
        return;
      }

      // Upgrade lifecycle to Confirmed
      const oldStatus = booking.status;
      await bookingRepository.updateStatus(bookingId, "Confirmed");

      // Log trail
      await createBookingHistoryUseCase.execute({
        bookingId: booking.id,
        oldStatus: oldStatus,
        newStatus: "Confirmed",
      });

      // Reserve actual room slots
      if (booking.details && booking.details.length > 0) {
        for (const detail of booking.details) {
          await roomRepository.updateStatus(detail.roomId, "Reserved");
        }
      }

      console.log(`[MOMO IPN] Success! Booking ${booking.code} confirms paid via MoMo.`);
    });
  },
};

export default handleMomoIPNUseCase;
