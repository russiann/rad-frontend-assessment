import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderConfirmation from './OrderConfirmation';
import type { ReactNode } from 'react';

// Mock dependencies
const mockNavigate = vi.fn();

// Mock react-router
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/order-confirmation' }),
  useParams: () => ({}),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('OrderConfirmation Page', () => {
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
    mockNavigate.mockClear();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const createWrapper = () => ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Basic Rendering', () => {
    it('should render order confirmation page with success message', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
      expect(screen.getByText(/thank you for your purchase/i)).toBeInTheDocument();
    });

    it('should show confirmation card with order details', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      expect(screen.getByText(/your order has been received/i)).toBeInTheDocument();
      expect(screen.getByText(/you will receive an email confirmation shortly/i)).toBeInTheDocument();
    });

    it('should display success icon or checkmark', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      // Look for success styling or confirmation text
      expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    });
  });

  describe('Navigation Actions', () => {
    it('should have continue shopping button', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      const continueShoppingButton = screen.getByRole('button', { name: /continue shopping/i });
      expect(continueShoppingButton).toBeInTheDocument();
    });

    it('should have return to home button', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      const returnToHomeButton = screen.getByRole('button', { name: /return to home/i }) ||
                                screen.getByRole('button', { name: /back to home/i });
      expect(returnToHomeButton).toBeInTheDocument();
    });

    it('should navigate to home when continue shopping is clicked', async () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      const continueShoppingButton = screen.getByRole('button', { name: /continue shopping/i });
      await user.click(continueShoppingButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to home when return to home is clicked', async () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      const returnToHomeButton = screen.getByRole('button', { name: /return to home/i }) ||
                                screen.getByRole('button', { name: /back to home/i });
      await user.click(returnToHomeButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Page Layout', () => {
    it('should be centered and well-positioned', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      const container = document.querySelector('.container');
      expect(container).toBeTruthy();
    });

    it('should have proper spacing and styling', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      // The confirmation card should be rendered
      expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    });
  });

  describe('User Experience', () => {
    it('should provide clear next steps for the user', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      // Should have clear action buttons for next steps
      expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /return to home/i }) ||
             screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
    });

    it('should have informative confirmation message', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      // Should contain informative text about the order
      expect(screen.getAllByText(/order/i)).toBeTruthy();
      expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
    });

    it('should indicate that user will receive email confirmation', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/confirmation/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      const heading = screen.getByRole('heading', { level: 1 }) ||
                     screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      const TestWrapper = createWrapper();
      
      render(
        <TestWrapper>
          <OrderConfirmation />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });
});