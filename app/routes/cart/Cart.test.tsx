import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Cart from './Cart';
import type { CartItem } from '../../contexts/CartContext';
import type { ReactNode } from 'react';

// Mock dependencies
const mockUpdateItemQuantity = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockClearCart = vi.fn();

// Create a mutable cart state
let mockCartState = {
  items: [] as CartItem[],
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  total: 0,
};

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Gaming Laptop',
    price: 999.99,
    image: '/laptop.jpg',
    quantity: 2,
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    price: 29.99,
    image: '/tshirt.jpg',
    quantity: 1,
  },
];

const mockCartActions = {
  addToCart: vi.fn(),
  removeFromCart: mockRemoveFromCart,
  updateItemQuantity: mockUpdateItemQuantity,
  clearCart: mockClearCart,
};

vi.mock('../../contexts/CartContext', () => ({
  useCartContext: () => ({
    state: mockCartState,
    actions: mockCartActions,
  }),
}));

// Mock useCart hook to return the mocked context
vi.mock('./useCart', () => ({
  useCart: () => ({
    state: mockCartState,
    actions: mockCartActions,
  }),
}));

// Mock react-router
vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useLocation: () => ({ pathname: '/cart' }),
  useParams: () => ({}),
}));

describe('Cart Page', () => {
  let queryClient: QueryClient;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    user = userEvent.setup();
    mockUpdateItemQuantity.mockClear();
    mockRemoveFromCart.mockClear();
    mockClearCart.mockClear();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const createWrapper = () => ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Cart with Items', () => {
    beforeEach(() => {
      // Set up cart with items
      mockCartState.items = mockCartItems;
      mockCartState.itemCount = 3;
      mockCartState.subtotal = 2029.97;
      mockCartState.tax = 203.00;
      mockCartState.total = 2232.97;
    });

    it('should render cart page with items', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
      expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
      expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
    });

    it('should display correct prices and quantities', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      expect(screen.getByText((content, element) => {
        return element?.textContent === '$999.99 each';
      })).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === '$29.99 each';
      })).toBeInTheDocument();
      // Gaming Laptop quantity - filter visible inputs only
      const quantity2Inputs = screen.getAllByDisplayValue('2').filter(input => 
        input.getAttribute('type') !== 'hidden'
      );
      expect(quantity2Inputs.length).toBeGreaterThan(0);
      // T-Shirt quantity - filter visible inputs only
      const quantity1Inputs = screen.getAllByDisplayValue('1').filter(input => 
        input.getAttribute('type') !== 'hidden'
      );
      expect(quantity1Inputs.length).toBeGreaterThan(0);
    });

    it('should display order summary correctly', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      // Use regex matching for currency values without thousands separator
      expect(screen.getByText(/\$2029\.97/)).toBeInTheDocument(); // Subtotal
      expect(screen.getByText(/\$203\.00/)).toBeInTheDocument(); // Tax
      expect(screen.getByText(/\$2232\.97/)).toBeInTheDocument(); // Total
    });

    it('should handle quantity updates', async () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      const increaseButtons = screen.getAllByRole('button', { name: /increase/i });
      await user.click(increaseButtons[0]);

      expect(mockUpdateItemQuantity).toHaveBeenCalledWith(1, 3);
    });

    it('should handle item removal', async () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
    });

    it('should show checkout button when items exist', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      expect(screen.getByRole('link', { name: /checkout/i })).toBeInTheDocument();
    });
  });

  describe('Empty Cart', () => {
    beforeEach(() => {
      // Set up empty cart
      mockCartState.items = [];
      mockCartState.itemCount = 0;
      mockCartState.subtotal = 0;
      mockCartState.tax = 0;
      mockCartState.total = 0;
    });

    it('should render empty cart component when no items', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      // Use flexible text matching for fragmented text
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Your cart is currently empty.';
      })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
    });

    it('should not render cart items when empty', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      expect(screen.queryByText('Gaming Laptop')).not.toBeInTheDocument();
      expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
    });
  });
});