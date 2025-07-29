import { addToast, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const showPriceUpdateToast = (productName: string, productId?: number) => {
  addToast({
    title: "Price Update!",
    description: `The price for ${productName} has been updated.`,
    timeout: 5000,
    icon: <Icon icon="lucide:bell" />,
    shouldShowTimeoutProgress: true,
    endContent: productId ? (
      <Button
        size="sm"
        variant="flat"
        color="primary"
        onPress={() => {
          window.location.href = `/product/${productId}`;
          addToast({
            title: "Navigating",
            description: `Viewing details for ${productName}`,
            icon: <Icon icon="lucide:eye" />,
          });
        }}
      >
        View Product
      </Button>
    ) : undefined,
  });
};

// New real-time notification for price changes
export function showRealTimePriceChangeToast(
  productName: string, 
  oldPrice: number, 
  newPrice: number, 
  productId?: number
) {
  const isReduction = newPrice < oldPrice;
  
  addToast({
    title: isReduction ? "💰 Price Reduced!" : "📈 Price Changed",
    description: `${productName}: $${oldPrice} → $${newPrice}`,
  });
}

export function showProductUnavailableToast(productName: string, productId?: number) {
  addToast({
    title: "🚫 Product Unavailable",
    description: `${productName} is temporarily out of stock.`,
  });
}

export function showProductBackInStockToast(productName: string, productId?: number) {
  addToast({
    title: "✅ Available Again!",
    description: `${productName} is back in stock.`,
  });
}

export const showAddedToCartToast = (productName: string) => {
  addToast({
    title: "Added to Cart",
    description: `${productName} has been added to your cart.`,
    timeout: 5000,
    shouldShowTimeoutProgress: true,
    icon: <Icon icon="lucide:check-circle" />,
    endContent: (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={() => {
            window.location.href = "/cart";
            addToast({
              title: "Cart",
              description: "Viewing your shopping cart",
              icon: <Icon icon="lucide:shopping-cart" />,
            });
          }}
        >
          View Cart
        </Button>
      </div>
    ),
  });
};

export const showErrorToast = (message: string) => {
  addToast({
    title: "Error",
    description: message,
    timeout: 5000,
    icon: <Icon icon="lucide:alert-triangle" />,
    endContent: (
      <Button 
        size="sm" 
        variant="flat" 
        color="danger"
        onPress={() => {
          addToast({
            title: "Dismissed",
            description: "Error notification dismissed",
            icon: <Icon icon="lucide:x" />,
          });
        }}
      >
        Dismiss
      </Button>
    ),
  });
};

export const showSuccessToast = (message: string, color: "success" | "danger" = "success") => {
  addToast({
    title: color === "success" ? "✅ Success!" : "❌ Error!",
    description: message,
    timeout: 3000,
  });
}; 