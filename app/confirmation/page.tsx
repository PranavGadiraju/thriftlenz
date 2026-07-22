import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/cart/order-confirmation";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your ThriftLenz order is confirmed.",
};

export default function ConfirmationPage() {
  return (
    <div className="container py-16 sm:py-24">
      <OrderConfirmation />
    </div>
  );
}
