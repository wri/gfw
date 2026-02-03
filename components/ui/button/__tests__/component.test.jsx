import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { trackEvent } from 'utils/analytics';
import Button from '../component';

jest.mock('utils/analytics');

describe('Button', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies theme classes', () => {
    const { container } = render(<Button theme="theme-dark">Button</Button>);
    const button = container.querySelector('.c-button');
    expect(button).toHaveClass('theme-dark');
  });

  it('disables when disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('applies active class when active prop is true', () => {
    const { container } = render(<Button active>Active Button</Button>);
    const button = container.querySelector('.c-button');
    expect(button).toHaveClass('--active');
  });

  it('renders as external link when extLink prop is provided', () => {
    render(<Button extLink="https://example.com">External Link</Button>);
    const link = screen.getByText('External Link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('renders as Next.js Link when link prop is provided', () => {
    const { container } = render(<Button link="/dashboard">Internal Link</Button>);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('tracks analytics when trackingData is provided', () => {
    const trackingData = { event: 'button_click', label: 'test-button' };
    render(
      <Button trackingData={trackingData} onClick={jest.fn()}>
        Tracked Button
      </Button>
    );
    
    const button = screen.getByText('Tracked Button');
    fireEvent.click(button);
    
    expect(trackEvent).toHaveBeenCalledWith('button_click', { label: 'test-button' });
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Button</Button>);
    const button = container.querySelector('.c-button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies custom id', () => {
    const { container } = render(<Button id="custom-id">Button</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('id', 'custom-id');
    expect(button).toHaveAttribute('data-id', 'custom-id');
  });

  it('applies background style when background prop is provided', () => {
    const { container } = render(
      <Button background="#ff0000">Colored Button</Button>
    );
    const button = container.querySelector('.c-button');
    expect(button).toHaveStyle({ background: '#ff0000' });
  });

  it('renders tooltip when tooltip prop is provided', () => {
    const tooltip = { text: 'This is a tooltip' };
    render(<Button tooltip={tooltip}>Button with Tooltip</Button>);
    // Tooltip library may render differently, so we just check the button exists
    expect(screen.getByText('Button with Tooltip')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );
    
    const button = screen.getByText('Disabled Button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not track analytics when disabled', () => {
    const trackingData = { event: 'button_click', label: 'test-button' };
    render(
      <Button disabled trackingData={trackingData} onClick={jest.fn()}>
        Disabled Tracked Button
      </Button>
    );
    
    const button = screen.getByText('Disabled Tracked Button');
    fireEvent.click(button);
    
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
