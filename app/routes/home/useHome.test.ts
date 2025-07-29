import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHome } from './useHome';
import type { Product } from '../../utils/trpc';
import { createElement, type ReactNode } from 'react';
import { showPriceUpdateToast } from '../../utils/notifications';

// Mock dependencies
const mockAddToCart = vi.fn();

vi.mock('../../contexts/CartContext', () => ({
  useCartContext: () => ({
    actions: {
      addToCart: mockAddToCart,
    },
  }),
}));

vi.mock('../../utils/notifications', () => ({
  showPriceUpdateToast: vi.fn(),
}));

// Mock tRPC
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    category: 'Electronics',
    description: 'A high-performance laptop',
    image: '/laptop.jpg',
    isAvailable: true,
    stock: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'T-Shirt',
    price: 29.99,
    category: 'Clothing',
    description: 'A comfortable t-shirt',
    image: '/tshirt.jpg',
    isAvailable: true,
    stock: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Sneakers',
    price: 79.99,
    category: 'Footwear',
    description: 'Comfortable running shoes',
    image: '/sneakers.jpg',
    isAvailable: false,
    stock: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockUseQuery = vi.fn();

vi.mock('../../utils/trpc', () => ({
  trpc: {
    product: {
      list: {
        useQuery: () => mockUseQuery(),
      },
    },
  },
}));

describe('useHome Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    mockAddToCart.mockClear();
    vi.mocked(showPriceUpdateToast).mockClear();
    mockUseQuery.mockReturnValue({
      data: mockProducts,
      isLoading: false,
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const createWrapper = () => ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      expect(result.current.state.selectedCategory).toBe('all');
      expect(result.current.state.selectedSort).toBe('default');
      expect(result.current.state.products).toEqual(mockProducts);
      expect(result.current.state.filteredProducts).toEqual(mockProducts);
      expect(result.current.state.isLoading).toBe(false);
    });
  });

  describe('Category Filtering', () => {
    it('should filter products by category', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.filterByCategory('Electronics');
      });

      expect(result.current.state.selectedCategory).toBe('Electronics');
      expect(result.current.state.filteredProducts).toHaveLength(1);
      expect(result.current.state.filteredProducts[0].name).toBe('Laptop');
    });

    it('should show all products when category is "all"', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.filterByCategory('Electronics');
      });

      act(() => {
        result.current.actions.filterByCategory('all');
      });

      expect(result.current.state.selectedCategory).toBe('all');
      expect(result.current.state.filteredProducts).toEqual(mockProducts);
    });

    it('should return empty array for non-existent category', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.filterByCategory('NonExistent');
      });

      expect(result.current.state.filteredProducts).toHaveLength(0);
    });
  });

  describe('Product Sorting', () => {
    it('should sort products by price low to high', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.sortProducts('low-to-high');
      });

      const sortedProducts = result.current.state.filteredProducts;
      expect(sortedProducts[0].price).toBe(29.99); // T-Shirt
      expect(sortedProducts[1].price).toBe(79.99); // Sneakers
      expect(sortedProducts[2].price).toBe(999.99); // Laptop
    });

    it('should sort products by price high to low', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.sortProducts('high-to-low');
      });

      const sortedProducts = result.current.state.filteredProducts;
      expect(sortedProducts[0].price).toBe(999.99); // Laptop
      expect(sortedProducts[1].price).toBe(79.99); // Sneakers
      expect(sortedProducts[2].price).toBe(29.99); // T-Shirt
    });

    it('should maintain original order for default sort', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.sortProducts('high-to-low');
      });

      act(() => {
        result.current.actions.sortProducts('default');
      });

      expect(result.current.state.filteredProducts).toEqual(mockProducts);
    });
  });

  describe('Combined Filtering and Sorting', () => {
    it('should apply both category filter and sorting', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.filterByCategory('Clothing');
      });

      act(() => {
        result.current.actions.sortProducts('low-to-high');
      });

      expect(result.current.state.filteredProducts).toHaveLength(1);
      expect(result.current.state.filteredProducts[0].name).toBe('T-Shirt');
    });
  });

  describe('Add to Cart', () => {
    it('should add existing product to cart', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.addToCart('Laptop', 1);
      });

      expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should not add non-existent product to cart', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.addToCart('NonExistent', 999);
      });

      expect(mockAddToCart).not.toHaveBeenCalled();
    });
  });

  describe('Update Price', () => {
    it('should call price update toast', () => {
      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.actions.updatePrice('Laptop', 1);
      });

      expect(vi.mocked(showPriceUpdateToast)).toHaveBeenCalledWith('Laptop', 1);
    });
  });

  describe('Loading State', () => {
    it('should handle loading state', () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: true,
      });

      const { result } = renderHook(() => useHome(), {
        wrapper: createWrapper(),
      });

      expect(result.current.state.isLoading).toBe(true);
      expect(result.current.state.products).toEqual([]);
    });
  });
});