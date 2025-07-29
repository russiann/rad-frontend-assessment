import React from "react";
import type { Route } from "./+types/Cart";
import { useCart } from "./useCart";
import { CartItems } from "./partials/CartItems";
import { EmptyCart } from "./partials/EmptyCart";
import { OrderSummary } from "./partials/OrderSummary";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shopping Cart - React Shopping" },
    { name: "description", content: "Review your cart items" },
  ];
}

export default function Cart() {
  const { state, actions } = useCart();

  if (state.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItems
            items={state.items}
            updateQuantity={actions.updateItemQuantity}
            removeItem={actions.removeFromCart}
          />
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary
            subtotal={state.subtotal}
            tax={state.tax}
            total={state.total}
          />
        </div>
      </div>
    </div>
  );
} 