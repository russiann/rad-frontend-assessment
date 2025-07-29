import React from "react";
import { Card, Image } from "@heroui/react";
import { Link } from "react-router";
import type { Product } from "../../../utils/trpc";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <Card key={product.id} isPressable className="pb-2" disableRipple>
            <Link to={`/product/${product.id}`} className="block">
              <Image
                removeWrapper
                alt={product.name}
                className="w-full h-40 object-cover"
                src={product.image}
              />
              <div className="p-3">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-default-600">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
} 