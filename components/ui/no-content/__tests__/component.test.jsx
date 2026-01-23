import React from 'react';
import { render, screen } from '@testing-library/react';
import NoContent from '../component';

describe('NoContent', () => {
  it('renders with message prop', () => {
    render(<NoContent message="No data available" />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<NoContent>Custom no content message</NoContent>);
    expect(screen.getByText('Custom no content message')).toBeInTheDocument();
  });

  it('prioritizes children over message prop', () => {
    render(
      <NoContent message="This should not show">This should show</NoContent>
    );
    expect(screen.getByText('This should show')).toBeInTheDocument();
    expect(screen.queryByText('This should not show')).not.toBeInTheDocument();
  });

  it('renders icon when icon prop is true', () => {
    const { container } = render(<NoContent icon message="No content" />);
    const icon = container.querySelector('.message-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe('IMG');
  });

  it('does not render icon when icon prop is false', () => {
    const { container } = render(<NoContent icon={false} message="No content" />);
    const icon = container.querySelector('.message-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('uses false as default for icon prop', () => {
    const { container } = render(<NoContent message="No content" />);
    const icon = container.querySelector('.message-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<NoContent className="custom-class" message="No content" />);
    const noContent = container.querySelector('.c-no-content');
    expect(noContent).toHaveClass('custom-class');
  });

  it('renders message with correct class', () => {
    const { container } = render(<NoContent message="No content" />);
    const message = container.querySelector('.message');
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('No content');
  });
});
