import React from "react";
import { Card, CardBody, Image, Button, Divider, NumberInput, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Product } from "../../../utils/trpc";

type ProductInfoProps = {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
};

export function ProductInfo({ product, quantity, setQuantity, handleAddToCart }: ProductInfoProps) {
  const isAvailable = product.isAvailable ?? true;
  
  return (
    <>
      {/* Product Image */}
      <div>
        <Card className="overflow-hidden">
          <CardBody className="p-0">
            <Image
              removeWrapper
              alt={product.name}
              src={product.image}
              className="w-full h-auto object-cover aspect-square"
            />
          </CardBody>
        </Card>
      </div>
      
      {/* Product Details */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          {/* Availability Status */}
          {!isAvailable && (
            <Chip color="danger" variant="flat" size="sm">
              Unavailable
            </Chip>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</span>
          <span className="text-sm text-default-500">Category: {product.category}</span>
        </div>
        
        <p className="text-default-700 mb-6">{product.description}</p>
        
        {/* Unavailability Warning */}
        {!isAvailable && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <div className="flex gap-3">
              <Icon icon="lucide:alert-triangle" className="text-danger mt-0.5" />
              <div>
                <p className="text-sm text-danger">
                  This product is temporarily unavailable. You will be notified when it's back in stock.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Divider className="my-6" />
        
        {/* Add to Cart Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <NumberInput
              label="Quantity"
              value={quantity}
              onValueChange={setQuantity}
              min={1}
              max={10}
              className="w-32"
              isDisabled={!isAvailable}
            />
            <Button 
              className="flex-1"
              color="primary"
              size="lg"
              onPress={handleAddToCart}
              isDisabled={!isAvailable}
            >
              {isAvailable ? "Add to Cart" : "Unavailable"}
            </Button>
          </div>
          
          <Button
            variant="bordered"
            size="lg"
            startContent={<Icon icon="lucide:heart" />}
            isDisabled={!isAvailable}
          >
            {isAvailable ? "Add to Wishlist" : "Product Unavailable"}
          </Button>
        </div>
      </div>
    </>
  );
} 