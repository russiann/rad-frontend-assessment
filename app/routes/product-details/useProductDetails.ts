import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc, type Product } from "../../utils/trpc";
import { useCartContext } from "../../contexts/CartContext";
import { useDevToggle } from "../../contexts/DevToggleContext";
import { 
  showRealTimePriceChangeToast, 
  showProductUnavailableToast, 
  showProductBackInStockToast 
} from "../../utils/notifications";

export function useProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { actions: cartActions } = useCartContext();
  const { isRealTimeNotificationsEnabled } = useDevToggle();
  const utils = trpc.useUtils();

  // Fetch single product (clean query without dev logic)
  const { data: product, isLoading: productLoading } = trpc.product.getById.useQuery(
    { id: parseInt(productId || "0") },
    { enabled: !!productId }
  );

  // Fetch all products for related products
  const { data: allProducts = [] } = trpc.product.list.useQuery();

  // Subscribe to product updates when real-time is enabled
  trpc.product.onUpdate.useSubscription(
    { productId: product?.id },
    {
      enabled: isRealTimeNotificationsEnabled && !!product,
      onData: (trackedUpdate) => {
        // When using tracked(), data comes in format: { id: string, data: T }
        const update = trackedUpdate.data;
        console.log('Received product update:', update);
        
        if (update.productId === product?.id) {
          if (update.type === 'price_change') {
            const { newPrice, productName } = update.data;
            const oldPrice = product?.price || 0;
            
            console.log('Showing price change toast:', { productName, oldPrice, newPrice });
            // Show notification
            showRealTimePriceChangeToast(productName, oldPrice, newPrice, product?.id);
            
          } else if (update.type === 'availability_change') {
            const { isAvailable: newAvailability, productName } = update.data;
            
            console.log('Showing availability change toast:', { productName, newAvailability });
            // Show appropriate notification
            if (newAvailability) {
              showProductBackInStockToast(productName, product?.id);
            } else {
              showProductUnavailableToast(productName, product?.id);
            }
          }
          
          // Refetch the product data from the database
          utils.product.getById.invalidate({ id: parseInt(productId || "0") });
        }
      },
    }
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p: Product) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product, allProducts]);

  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const addToCart = () => {
    if (product && (product.isAvailable ?? true)) {
      // Add to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        cartActions.addToCart(product);
      }
      // Reset quantity to 1 after adding
      setQuantity(1);
    }
  };

  return {
    state: {
      product,
      quantity,
      relatedProducts,
      isLoading: productLoading,
      // Use data directly from the database
      isAvailable: product?.isAvailable ?? true,
      currentPrice: product?.price ?? null,
      isRealTimeEnabled: isRealTimeNotificationsEnabled,
    },
    actions: {
      updateQuantity,
      addToCart,
    },
  };
} 