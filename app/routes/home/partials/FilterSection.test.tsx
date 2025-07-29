import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterSection } from './FilterSection';

describe('FilterSection', () => {
  const mockOnCategoryFilter = vi.fn();
  const mockOnSortChange = vi.fn();

  const defaultProps = {
    selectedCategory: 'all',
    selectedSort: 'default',
    onCategoryFilter: mockOnCategoryFilter,
    onSortChange: mockOnSortChange,
  };

  beforeEach(() => {
    mockOnCategoryFilter.mockClear();
    mockOnSortChange.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render category and sort buttons', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.getByText('Filter by Category')).toBeInTheDocument();
      expect(screen.getByText('Sort by Price')).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('should show category options when clicked', async () => {
      const user = userEvent.setup();
      render(<FilterSection {...defaultProps} />);

      const categoryButton = screen.getByText('Filter by Category');
      await user.click(categoryButton);

      await waitFor(() => {
        expect(screen.getByText('All Categories')).toBeInTheDocument();
        expect(screen.getByText('Electronics')).toBeInTheDocument();
        expect(screen.getByText('Clothing')).toBeInTheDocument();
        expect(screen.getByText('Footwear')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
      });
    });

    it('should call onCategoryFilter when category is selected', async () => {
      const user = userEvent.setup();
      render(<FilterSection {...defaultProps} />);

      const categoryButton = screen.getByText('Filter by Category');
      await user.click(categoryButton);

      const electronicsOption = screen.getByText('Electronics');
      await user.click(electronicsOption);

      expect(mockOnCategoryFilter).toHaveBeenCalledWith('electronics');
    });

    it('should call onCategoryFilter with "all" for All Categories', async () => {
      const user = userEvent.setup();
      render(<FilterSection {...defaultProps} />);

      const categoryButton = screen.getByText('Filter by Category');
      await user.click(categoryButton);

      const allCategoriesOption = screen.getByText('All Categories');
      await user.click(allCategoriesOption);

      expect(mockOnCategoryFilter).toHaveBeenCalledWith('all');
    });
  });

  describe('Price Sorting', () => {
    it('should show sort options when clicked', async () => {
      const user = userEvent.setup();
      render(<FilterSection {...defaultProps} />);

      const sortButton = screen.getByText('Sort by Price');
      await user.click(sortButton);

      await waitFor(() => {
        expect(screen.getByText('Default')).toBeInTheDocument();
        expect(screen.getByText('Low to High')).toBeInTheDocument();
        expect(screen.getByText('High to Low')).toBeInTheDocument();
      });
    });

    it('should call onSortChange when sort option is selected', async () => {
      const user = userEvent.setup();
      render(<FilterSection {...defaultProps} />);

      const sortButton = screen.getByText('Sort by Price');
      await user.click(sortButton);

      const lowToHighOption = screen.getByText('Low to High');
      await user.click(lowToHighOption);

      expect(mockOnSortChange).toHaveBeenCalledWith('low-to-high');
    });

    it('should call onSortChange with correct values for all options', async () => {
      const user = userEvent.setup();
      render(<FilterSection {...defaultProps} />);

      const sortButton = screen.getByText('Sort by Price');

      // Test Default
      await user.click(sortButton);
      await user.click(screen.getByText('Default'));
      expect(mockOnSortChange).toHaveBeenCalledWith('default');

      // Test High to Low
      await user.click(sortButton);
      await user.click(screen.getByText('High to Low'));
      expect(mockOnSortChange).toHaveBeenCalledWith('high-to-low');
    });
  });

  describe('Props Handling', () => {
    it('should handle different selectedCategory values', () => {
      const propsWithElectronics = {
        ...defaultProps,
        selectedCategory: 'electronics',
      };

      render(<FilterSection {...propsWithElectronics} />);
      expect(screen.getByText('Filter by Category')).toBeInTheDocument();
    });

    it('should handle different selectedSort values', () => {
      const propsWithSort = {
        ...defaultProps,
        selectedSort: 'low-to-high',
      };

      render(<FilterSection {...propsWithSort} />);
      expect(screen.getByText('Sort by Price')).toBeInTheDocument();
    });
  });

  describe('snapshots', () => {
    it('renders filter section correctly', () => {
      const { container } = render(<FilterSection {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with electronics category selected', () => {
      const props = { ...defaultProps, selectedCategory: 'electronics' };
      const { container } = render(<FilterSection {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with low-to-high sort selected', () => {
      const props = { ...defaultProps, selectedSort: 'low-to-high' };
      const { container } = render(<FilterSection {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});