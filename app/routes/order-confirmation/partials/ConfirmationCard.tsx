import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

type ConfirmationCardProps = {
  onContinueShopping: () => void;
  onReturnToHome: () => void;
};

export function ConfirmationCard({ onContinueShopping, onReturnToHome }: ConfirmationCardProps) {
  return (
    <Card className="max-w-md w-full">
      <CardBody className="py-12 px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-success/10 rounded-full p-4">
            <Icon 
              icon="lucide:check" 
              className="text-success text-6xl" 
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-semibold mb-3">Order Confirmed!</h1>
        
        <p className="text-default-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive an email confirmation shortly.
        </p>
        
        <div className="flex flex-col gap-4">
          <Button 
            color="primary"
            size="lg"
            className="w-full"
            startContent={<Icon icon="lucide:shopping-bag" />}
            onPress={onContinueShopping}
          >
            Continue Shopping
          </Button>
          
          <Button
            variant="flat"
            color="default"
            size="lg"
            className="w-full"
            startContent={<Icon icon="lucide:home" />}
            onPress={onReturnToHome}
          >
            Return to Home
          </Button>
        </div>
      </CardBody>
    </Card>
  );
} 