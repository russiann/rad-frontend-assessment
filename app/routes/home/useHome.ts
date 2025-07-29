import { useState, useMemo } from "react";
import { showPriceUpdateToast } from "../../utils/notifications";
import { trpc, type Product } from "../../utils/trpc";
import { useCartContext } from "../../contexts/CartContext";

export function useHome() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("default");
  const { actions: cartActions } = useCartContext();

  // Fetch products using tRPC
  const { data: products = [], isLoading } = trpc.product.list.useQuery();

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product: Product) => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    if (selectedSort === "low-to-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (selectedSort === "high-to-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, selectedCategory, selectedSort]);

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const sortProducts = (sort: string) => {
    setSelectedSort(sort);
  };

  const addToCart = (productName: string, productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      cartActions.addToCart(product);
    }
  };

  const updatePrice = (productName: string, productId: number) => {
    showPriceUpdateToast(productName, productId);
  };

  return {
    state: {
      products,
      filteredProducts,
      selectedCategory,
      selectedSort,
      isLoading,
    },
    actions: {
      filterByCategory,
      sortProducts,
      addToCart,
      updatePrice,
    },
  };
} 