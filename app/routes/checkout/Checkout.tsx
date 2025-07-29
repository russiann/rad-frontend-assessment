import React from "react";
import type { Route } from "./+types/Checkout";
import { useCheckout } from "./useCheckout";
import { CheckoutForm } from "./partials/CheckoutForm";
import { OrderSummary } from "./partials/OrderSummary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - React Shopping" },
    { name: "description", content: "Complete your purchase" },
  ];
}

export default function Checkout() {
  const { state, actions, form } = useCheckout();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
        <p className="text-default-500 text-lg">Complete your purchase securely</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <CheckoutForm
            control={form.control}
            errors={form.errors}
            onSubmit={actions.submitOrder}
            isLoading={state.isLoading}
            apiError={state.apiError}
            isValid={state.isValid}
            onClearError={actions.clearError}
          />
        </div>
        
        <div>
          <div className="sticky top-6">
            <OrderSummary
              orderItems={state.orderItems}
              subtotal={state.subtotal}
              shipping={state.shipping}
              tax={state.tax}
              total={state.total}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 