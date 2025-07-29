import React from "react";
import { Button, Card, Image, Badge, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { showPriceUpdateToast } from "../../../utils/notifications";
import type { Product } from "../../../utils/trpc";
import { cn } from "@heroui/react";
import { useChatContext } from "../../../contexts/ChatContext";

type ProductGridProps = {
  products: Product[];
  onAddToCart: (productName: string, productId: number) => void;
};

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const { isOpen: isChatOpen } = useChatContext();
  
  // Adaptive grid classes based on chat state and screen size
  const getGridClasses = () => {
    if (isChatOpen) {
      // When chat is open, use smaller minimum card width for better fitting
      return "grid gap-6";
    } else {
      // When chat is closed, allow more columns
      return "grid gap-6";
    }
  };

  const getGridStyle = () => {
    if (isChatOpen) {
      // When chat is open, minimum card width is larger to ensure good proportions
      return { 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
      };
    } else {
      // When chat is closed, allow smaller minimum width for more columns
      return { 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
      };
    }
  };

  return (
    <div className={getGridClasses()} style={getGridStyle()}>
      {products.map((product) => {
        const isAvailable = product.isAvailable ?? true;
        
        return (
          <Card key={product.id} className="relative">
            {product.id === 3 && (
              <Badge 
                content="SALE" 
                color="danger" 
                placement="top-right"
                className="z-10 m-2 cursor-pointer"
                onClick={() => showPriceUpdateToast(product.name, product.id)}
              >
                <span></span>
              </Badge>
            )}
            
            {/* Availability indicator */}
            {!product.isAvailable && (
              <Chip 
                size="sm" 
                color="danger" 
                variant="flat"
                className="absolute top-2 left-2 z-10"
              >
                Unavailable
              </Chip>
            )}
            
            <Link to={`/product/${product.id}`}>
              <div className={`relative ${!isAvailable ? 'opacity-75' : ''}`}>
                <Image
                  removeWrapper
                  alt={product.name}
                  className="w-full h-60 object-cover cursor-pointer transition-transform hover:scale-[1.03]"
                  src={product.image}
                />
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Icon icon="lucide:x-circle" className="text-white text-4xl" />
                  </div>
                )}
              </div>
            </Link>
            
            <div className="p-4 space-y-3">
              <Link to={`/product/${product.id}`} className="block">
                <h3 className={`font-semibold text-lg hover:text-primary transition-colors ${!isAvailable ? 'text-default-400' : ''}`}>
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className={`font-medium ${!isAvailable ? 'text-default-400' : 'text-default-600'}`}>
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-xs text-default-500">{product.category}</p>
              </div>
              <Button 
                className={cn(
                  "w-full",
                  !isAvailable && "opacity-50 cursor-not-allowed"
                )}
                color="primary"
                variant="flat"
                size="sm"
                onPress={() => isAvailable && onAddToCart(product.name, product.id)}
                isDisabled={!isAvailable}
              >
                {isAvailable ? "Add to Cart" : "Unavailable"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
} 