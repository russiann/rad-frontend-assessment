import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ErrorAlert } from './ErrorAlert'

describe('ErrorAlert', () => {
  describe('snapshots', () => {
    it('renders default variant correctly', () => {
      const { container } = render(
        <ErrorAlert error="Default error" />
      )
      expect(container).toMatchSnapshot()
    })

    it('renders inline variant correctly', () => {
      const { container } = render(
        <ErrorAlert error="Inline error" variant="inline" />
      )
      expect(container).toMatchSnapshot()
    })

    it('renders with dismiss button correctly', () => {
      const mockDismiss = vi.fn()
      const { container } = render(
        <ErrorAlert 
          error="Error with dismiss" 
          onDismiss={mockDismiss} 
        />
      )
      expect(container).toMatchSnapshot()
    })

    it('renders with custom className correctly', () => {
      const { container } = render(
        <ErrorAlert 
          error="Error with custom class" 
          className="custom-class" 
        />
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('rendering', () => {
    it('displays error message', () => {
      render(<ErrorAlert error="Test error message" />)
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('displays alert icon', () => {
      const { container } = render(<ErrorAlert error="Test error" />)
      const iconElement = container.querySelector('span:first-child')
      expect(iconElement).toBeInTheDocument()
    })

    it('applies default variant styling by default', () => {
      render(<ErrorAlert error="Test error" />)
      const container = screen.getByText('Test error').closest('div')?.parentElement?.parentElement
      expect(container).toHaveClass('p-3', 'bg-danger-50', 'border', 'border-danger-200', 'rounded-lg')
    })

    it('applies custom className when provided', () => {
      render(<ErrorAlert error="Test error" className="my-custom-class" />)
      const container = screen.getByText('Test error').closest('div')?.parentElement?.parentElement
      expect(container).toHaveClass('my-custom-class')
    })
  })

  describe('inline variant', () => {
    it('renders inline variant without dismiss button', () => {
      render(<ErrorAlert error="Inline error" variant="inline" />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('has simplified layout for inline variant', () => {
      render(<ErrorAlert error="Inline error" variant="inline" />)
      const errorContainer = screen.getByText('Inline error').parentElement
      expect(errorContainer).toHaveClass('flex', 'items-center', 'gap-2')
    })
  })

  describe('default variant', () => {
    it('renders without dismiss button when onDismiss not provided', () => {
      render(<ErrorAlert error="Default error" />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders with dismiss button when onDismiss provided', () => {
      const mockDismiss = vi.fn()
      render(<ErrorAlert error="Default error" onDismiss={mockDismiss} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has justify-between layout for default variant', () => {
      render(<ErrorAlert error="Default error" />)
      const errorContainer = screen.getByText('Default error').parentElement?.parentElement
      expect(errorContainer).toHaveClass('flex', 'items-center', 'justify-between')
    })
  })

  describe('dismiss functionality', () => {
    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup()
      const mockDismiss = vi.fn()
      
      render(<ErrorAlert error="Dismissible error" onDismiss={mockDismiss} />)
      
      const dismissButton = screen.getByRole('button')
      await user.click(dismissButton)
      
      expect(mockDismiss).toHaveBeenCalledOnce()
    })

    it('does not render dismiss button in inline variant even with onDismiss', () => {
      const mockDismiss = vi.fn()
      render(
        <ErrorAlert 
          error="Inline error" 
          variant="inline" 
          onDismiss={mockDismiss} 
        />
      )
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('dismiss button has proper attributes', () => {
      const mockDismiss = vi.fn()
      render(<ErrorAlert error="Error with dismiss" onDismiss={mockDismiss} />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('error text has proper styling for readability', () => {
      render(<ErrorAlert error="Accessible error" />)
      const errorText = screen.getByText('Accessible error')
      expect(errorText).toHaveClass('text-danger-700', 'text-sm')
    })
  })
})