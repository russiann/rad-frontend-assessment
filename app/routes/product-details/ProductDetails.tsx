import React from "react";
import type { Route } from "./+types/ProductDetails";
import { useProductDetails } from "./useProductDetails";
import { ProductInfo } from "./partials/ProductInfo";
import { ProductTabs } from "./partials/ProductTabs";
import { RelatedProducts } from "./partials/RelatedProducts";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Product ${params.productId} - React Shopping` },
    { name: "description", content: "View product details and add to cart" },
  ];
}

export default function ProductDetails() {
  const { state, actions } = useProductDetails();

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!state.product) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductInfo
          product={state.product}
          quantity={state.quantity}
          setQuantity={actions.updateQuantity}
          handleAddToCart={actions.addToCart}
        />
      </div>
      
      <ProductTabs product={state.product} />
      
      {state.relatedProducts.length > 0 && (
        <RelatedProducts
          products={state.relatedProducts}
        />
      )}
    </div>
  );
} 