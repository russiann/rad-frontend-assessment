import React from "react";
import type { Route } from "./+types/OrderConfirmation";
import { useOrderConfirmation } from "./useOrderConfirmation";
import { ConfirmationCard } from "./partials/ConfirmationCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Order Confirmation - React Shopping" },
    { name: "description", content: "Your order has been confirmed" },
  ];
}

export default function OrderConfirmation() {
  const { actions } = useOrderConfirmation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl flex justify-center items-center">
      <ConfirmationCard 
        onContinueShopping={actions.continueShopping}
        onReturnToHome={actions.returnToHome}
      />
    </div>
  );
} 