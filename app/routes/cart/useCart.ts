import { useCartContext } from "../../contexts/CartContext";

export type { CartItem } from "../../contexts/CartContext";

export function useCart() {
  const { state, actions } = useCartContext();

  return {
    state,
    actions,
  };
} 