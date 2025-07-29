import React from "react";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";

type OrderSummaryProps = {
  subtotal: number;
  tax: number;
  total: number;
};

export function OrderSummary({ subtotal, tax, total }: OrderSummaryProps) {
  return (
    <div>
      <Card className="sticky top-4">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-default-600">Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-default-600">Tax (8%)</p>
              <p>${tax.toFixed(2)}</p>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">${total.toFixed(2)}</p>
            </div>
          </div>
          
          <Button
            color="primary"
            size="lg"
            className="mt-6 w-full"
            as={Link}
            to="/checkout"
            startContent={<Icon icon="lucide:credit-card" />}
          >
            Proceed to Checkout
          </Button>
          
          <Link to="/" className="text-sm text-primary flex items-center justify-center mt-4">
            <Icon icon="lucide:arrow-left" className="mr-1" />
            Continue Shopping
          </Link>
        </CardBody>
      </Card>
    </div>
  );
} 