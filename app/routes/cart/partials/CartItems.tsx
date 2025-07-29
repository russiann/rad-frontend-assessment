import React from "react";
import { Card, CardBody, Image, Button, NumberInput } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { CartItem } from "../useCart";

type CartItemsProps = {
  items: CartItem[];
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
};

export function CartItems({ items, updateQuantity, removeItem }: CartItemsProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-visible">
          <CardBody className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-24 h-24 flex-shrink-0">
                <Image
                  removeWrapper
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                  src={item.image}
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <p className="text-default-500 text-sm">${item.price.toFixed(2)} each</p>
                <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                  <div className="w-32">
                    <NumberInput
                      label="Quantity"
                      value={item.quantity}
                      onValueChange={(value) => updateQuantity(item.id, value)}
                      min={1}
                      max={10}
                    />
                  </div>
                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    onPress={() => removeItem(item.id)}
                    startContent={<Icon icon="lucide:trash-2" />}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
} 