import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { showAddedToCartToast } from '../utils/notifications';
import type { Product } from '../utils/trpc';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
};

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartItem[] };

type CartContextType = {
  state: CartState;
  actions: {
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    updateItemQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
  };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.08;
const STORAGE_KEY = 'react-shopping-cart';

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newItems: CartItem[];
  
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            id: action.payload.id,
            name: action.payload.name,
            price: action.payload.price,
            quantity: 1,
            image: action.payload.image,
          }
        ];
      }
      break;
      
    case 'REMOVE_FROM_CART':
      newItems = state.items.filter(item => item.id !== action.payload);
      break;
      
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        newItems = state.items.filter(item => item.id !== action.payload.id);
      } else {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      break;
      
    case 'CLEAR_CART':
      newItems = [];
      break;
      
    case 'LOAD_FROM_STORAGE':
      newItems = action.payload;
      break;
      
    default:
      return state;
  }
  
  const totals = calculateTotals(newItems);
  
  return {
    items: newItems,
    ...totals,
  };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items]);

  const actions = {
    addToCart: (product: Product) => {
      dispatch({ type: 'ADD_TO_CART', payload: product });
      showAddedToCartToast(product.name);
    },
    
    removeFromCart: (id: number) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    },
    
    updateItemQuantity: (id: number, quantity: number) => {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    },
    
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
  };

  return (
    <CartContext.Provider value={{ state, actions }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
} 