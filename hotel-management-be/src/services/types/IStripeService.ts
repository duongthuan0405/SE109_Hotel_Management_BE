import Stripe from "stripe";

export type CreateCheckoutSessionInput = {
  bookingId: string;
  customerEmail?: string | undefined;
  amount: number;
  roomClassName: string;
  startDate: Date;
  endDate: Date;
  successUrl: string;
  cancelUrl: string;
};

export type IStripeService = {
  createCheckoutSession: (input: CreateCheckoutSessionInput) => Promise<Stripe.Checkout.Session>;
  retrieveSession: (sessionId: string) => Promise<Stripe.Checkout.Session>;
  constructWebhookEvent: (payload: string | Buffer, header: string, secret: string) => Stripe.Event;
};
