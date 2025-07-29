import React from "react";
import { Card, CardBody, Divider } from "@heroui/react";
import type { OrderItem } from "../useCheckout";

type OrderSummaryProps = {
  orderItems: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export function OrderSummary({ orderItems, subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <div className="lg:w-96">
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {/* Order Items */}
          <div className="space-y-3 mb-6">
            {orderItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span className="text-default-600">
                  {item.name} <span className="text-default-400">x{item.quantity}</span>
                </span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <Divider className="my-4" />
          
          {/* Order Calculations */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-default-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <Divider className="my-4" />
          
          {/* Total */}
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 