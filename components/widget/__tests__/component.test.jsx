import React from 'react';
import { render, screen } from '@testing-library/react';
import Widget from '../component';

jest.mock('../components/widget-header', () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="widget-header">{title}</div>,
}));

jest.mock('../components/widget-body', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="widget-body">{children}</div>,
}));

jest.mock('../components/widget-footer', () => ({
  __esModule: true,
  default: () => <div data-testid="widget-footer">Footer</div>,
}));

describe('Widget', () => {
  const defaultProps = {
    widget: 'tree-loss',
    title: 'Tree Loss',
    type: 'chart',
    handleIsPlaceholderImage: jest.fn(() => false),
    onClickWidget: jest.fn(),
  };

  it('renders widget with title', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.getByTestId('widget-header')).toHaveTextContent('Tree Loss');
  });

  it('renders widget header', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.getByTestId('widget-header')).toBeInTheDocument();
  });

  it('renders widget body', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.getByTestId('widget-body')).toBeInTheDocument();
  });

  it('renders widget footer when sentence and data are provided', () => {
    render(
      <Widget
        {...defaultProps}
        sentence={{ sentence: 'test', params: {} }}
        data={[{}]}
      />
    );
    expect(screen.getByTestId('widget-footer')).toBeInTheDocument();
  });

  it('does not render widget footer when sentence or data are missing', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.queryByTestId('widget-footer')).not.toBeInTheDocument();
  });

  it('applies active styling when active prop is true', () => {
    const { container } = render(
      <Widget {...defaultProps} active colors={{ main: '#000' }} />
    );
    const widget = container.querySelector('.c-widget');
    expect(widget).toBeInTheDocument();
    expect(widget).toHaveStyle({ borderColor: '#000' });
  });

  it('applies simple class when simple prop is true', () => {
    const { container } = render(<Widget {...defaultProps} simple />);
    const widget = container.querySelector('.c-widget');
    expect(widget).toHaveClass('simple');
  });

  it('applies large class when large prop is true', () => {
    const { container } = render(<Widget {...defaultProps} large />);
    const widget = container.querySelector('.c-widget');
    expect(widget).toHaveClass('large');
  });

  it('applies embed class when embed prop is true', () => {
    const { container } = render(<Widget {...defaultProps} embed />);
    const widget = container.querySelector('.c-widget');
    expect(widget).toHaveClass('embed');
  });

  it('handles loading state', () => {
    render(<Widget {...defaultProps} loading />);
    expect(screen.getByTestId('widget-header')).toBeInTheDocument();
  });

  it('handles error state', () => {
    render(<Widget {...defaultProps} error />);
    expect(screen.getByTestId('widget-header')).toBeInTheDocument();
  });
});
