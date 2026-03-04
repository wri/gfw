import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../component';

describe('Loader', () => {
  it('renders loader with spinner', () => {
    const { container } = render(<Loader />);
    const loader = container.querySelector('.c-loader');
    const spinner = container.querySelector('.spinner');
    expect(loader).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
  });

  it('renders message when message prop is provided', () => {
    render(<Loader message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('does not render message when message prop is not provided', () => {
    const { container } = render(<Loader />);
    const message = container.querySelector('.message');
    expect(message).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Loader className="custom-loader" />);
    const loader = container.querySelector('.c-loader');
    expect(loader).toHaveClass('custom-loader');
  });

  it('applies theme className', () => {
    const { container } = render(<Loader theme="theme-light" />);
    const loader = container.querySelector('.c-loader');
    expect(loader).toHaveClass('theme-light');
  });

  it('renders message with correct class', () => {
    const { container } = render(<Loader message="Loading..." />);
    const message = container.querySelector('.message');
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Loading...');
  });
});
