import React from 'react';
import { render } from '@testing-library/react';
import Icon from '../component';

describe('Icon', () => {
  const mockIcon = {
    id: 'test-icon',
    viewBox: '0 0 24 24',
  };

  it('renders with icon object', () => {
    const { container } = render(<Icon icon={mockIcon} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders with icon string', () => {
    const { container } = render(<Icon icon="icon-name" />);
    const svg = container.querySelector('svg');
    const use = svg.querySelector('use');
    // xlinkHref in JSX becomes xlink:href in the DOM
    expect(use).toHaveAttribute('xlink:href', '#icon-name');
  });

  it('uses default viewBox when not provided', () => {
    const iconWithoutViewBox = { id: 'test-icon' };
    const { container } = render(<Icon icon={iconWithoutViewBox} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
  });

  it('applies custom className', () => {
    const { container } = render(<Icon icon={mockIcon} className="custom-icon" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('c-icon');
    expect(svg).toHaveClass('custom-icon');
  });

  it('applies custom style', () => {
    const customStyle = { width: '24px', height: '24px' };
    const { container } = render(<Icon icon={mockIcon} style={customStyle} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle(customStyle);
  });

  it('uses empty className by default', () => {
    const { container } = render(<Icon icon={mockIcon} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('c-icon');
    // className includes the default empty string, resulting in "c-icon "
    expect(svg.getAttribute('class')).toBe('c-icon ');
  });

  it('handles icon with id property', () => {
    const { container } = render(<Icon icon={mockIcon} />);
    const svg = container.querySelector('svg');
    const use = svg.querySelector('use');
    // xlinkHref in JSX becomes xlink:href in the DOM
    expect(use).toHaveAttribute('xlink:href', '#test-icon');
  });
});
