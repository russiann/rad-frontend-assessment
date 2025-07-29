import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductGrid } from './ProductGrid';
import type { Product } from '../../../utils/trpc';

// Mock dependencies
vi.mock('../../../utils/notifications', () => ({
  showPriceUpdateToast: vi.fn(),
}));

vi.mock('../../../contexts/ChatContext', () => ({
  useChatContext: () => ({
    isOpen: false,
  }),
}));

// Mock react-router Link
vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('ProductGrid', () => {
  const mockOnAddToCart = vi.fn();

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Gaming Laptop',
      price: 999.99,
      category: 'Electronics',
      description: 'High-performance gaming laptop',
      image: '/laptop.jpg',
      isAvailable: true,
      stock: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      price: 29.99,
      category: 'Clothing',
      description: 'Comfortable cotton t-shirt',
      image: '/tshirt.jpg',
      isAvailable: true,
      stock: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 79.99,
      category: 'Footwear',
      description: 'Lightweight running shoes',
      image: '/shoes.jpg',
      isAvailable: false,
      stock: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const defaultProps = {
    products: mockProducts,
    onAddToCart: mockOnAddToCart,
  };

  beforeEach(() => {
    mockOnAddToCart.mockClear();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render all products', () => {
      render(<ProductGrid {...defaultProps} />);

      expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
      expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
      expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    });

    it('should display product prices correctly', () => {
      render(<ProductGrid {...defaultProps} />);

      expect(screen.getByText('$999.99')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$79.99')).toBeInTheDocument();
    });

    it('should display product categories', () => {
      render(<ProductGrid {...defaultProps} />);

      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.getByText('Footwear')).toBeInTheDocument();
    });

    it('should render product links correctly', () => {
      render(<ProductGrid {...defaultProps} />);

      const laptopLinks = screen.getAllByRole('link');
      const productLink = laptopLinks.find(link => 
        link.getAttribute('href') === '/product/1'
      );
      expect(productLink).toBeInTheDocument();
    });
  });

  describe('Product Availability', () => {
    it('should show "Add to Cart" for available products', () => {
      render(<ProductGrid {...defaultProps} />);

      const addToCartButtons = screen.getAllByText('Add to Cart');
      expect(addToCartButtons).toHaveLength(2); // Only available products
    });

    it('should show "Unavailable" for unavailable products', () => {
      render(<ProductGrid {...defaultProps} />);

      expect(screen.getAllByText('Unavailable')).toHaveLength(2); // Chip + Button
      
      const unavailableButton = screen.getByRole('button', { name: /unavailable/i });
      expect(unavailableButton).toBeDisabled();
    });

    it('should show unavailable chip for unavailable products', () => {
      render(<ProductGrid {...defaultProps} />);

      // Check for the unavailable chip/badge
      const unavailableElements = screen.getAllByText('Unavailable');
      expect(unavailableElements).toHaveLength(2); // Chip + Button
      expect(unavailableElements[0]).toBeInTheDocument();
    });
  });

  describe('Add to Cart Functionality', () => {
    it('should call onAddToCart when clicking available product button', async () => {
      const user = userEvent.setup();
      render(<ProductGrid {...defaultProps} />);

      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]);

      expect(mockOnAddToCart).toHaveBeenCalledWith('Gaming Laptop', 1);
    });

    it('should not call onAddToCart for unavailable products', async () => {
      const user = userEvent.setup();
      render(<ProductGrid {...defaultProps} />);

      const unavailableButton = screen.getByRole('button', { name: /unavailable/i });
      
      // Try to click but it shouldn't work since it's disabled
      await user.click(unavailableButton);
      expect(mockOnAddToCart).not.toHaveBeenCalled();
    });
  });

  describe('Special Product Features', () => {
    it('should show SALE badge for product ID 3', () => {
      const productsWithSale = [
        {
          id: 3,
          name: 'Sale Item',
          price: 99.99,
          category: 'Electronics',
          description: 'On sale item',
          image: '/sale.jpg',
          isAvailable: true,
          stock: 10,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      render(<ProductGrid products={productsWithSale} onAddToCart={mockOnAddToCart} />);

      expect(screen.getByText('SALE')).toBeInTheDocument();
    });

    it('should call price update toast when clicking SALE badge', async () => {
      const user = userEvent.setup();
      const productsWithSale = [
        {
          id: 3,
          name: 'Sale Item',
          price: 99.99,
          category: 'Electronics',
          description: 'On sale item',
          image: '/sale.jpg',
          isAvailable: true,
          stock: 10,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const { showPriceUpdateToast } = await import('../../../utils/notifications');

      render(<ProductGrid products={productsWithSale} onAddToCart={mockOnAddToCart} />);

      const saleBadge = screen.getByText('SALE');
      await user.click(saleBadge);

      expect(showPriceUpdateToast).toHaveBeenCalledWith('Sale Item', 3);
    });
  });

  describe('Empty State', () => {
    it('should render empty grid when no products', () => {
      render(<ProductGrid products={[]} onAddToCart={mockOnAddToCart} />);

      expect(screen.queryByText('Gaming Laptop')).not.toBeInTheDocument();
      expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
    });
  });

  describe('Chat Context Integration', () => {
    it('should adjust grid layout when chat is open', () => {
      // Mock chat as open
      vi.doMock('../../../contexts/ChatContext', () => ({
        useChatContext: () => ({
          isOpen: true,
        }),
      }));

      render(<ProductGrid {...defaultProps} />);

      // The grid should still render products regardless of chat state
      expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
    });
  });

  describe('snapshots', () => {
    it('renders product grid correctly', () => {
      const { container } = render(<ProductGrid {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with empty products array', () => {
      const { container } = render(
        <ProductGrid products={[]} onAddToCart={mockOnAddToCart} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with mix of available and unavailable products', () => {
      const { container } = render(<ProductGrid {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});