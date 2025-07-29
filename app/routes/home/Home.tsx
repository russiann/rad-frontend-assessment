import React from "react";
import type { Route } from "./+types/Home";
import { useHome } from "./useHome";
import { FilterSection } from "./partials/FilterSection";
import { ProductGrid } from "./partials/ProductGrid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Products - React Shopping" },
    { name: "description", content: "Browse our amazing products!" },
  ];
}

export default function Home() {
  const { state, actions } = useHome();

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-6">
        <div>
          <FilterSection
            selectedCategory={state.selectedCategory}
            selectedSort={state.selectedSort}
            onCategoryFilter={actions.filterByCategory}
            onSortChange={actions.sortProducts}
          />
        </div>
        
        <div>
          <ProductGrid
            products={state.filteredProducts}
            onAddToCart={actions.addToCart}
          />
        </div>
      </div>
    </div>
  );
} 