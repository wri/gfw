import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Share from '../component';

jest.mock('components/modal', () => ({
  __esModule: true,
  default: ({ children, open }) =>
    open ? <div data-testid="modal">{children}</div> : null,
}));

jest.mock('utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

describe('Share Modal', () => {
  const mockSetShareOpen = jest.fn();
  const mockSetShareSelected = jest.fn();
  const mockHandleCopyToClipboard = jest.fn();
  const mockSetShareAoi = jest.fn();

  const defaultProps = {
    open: true,
    selected: 'link',
    copied: false,
    loading: false,
    data: {
      title: 'Share Widget',
      shareUrl: 'https://example.com/share',
      embedUrl: 'https://example.com/embed',
      embedSettings: { width: 670, height: 490 },
    },
    setShareOpen: mockSetShareOpen,
    setShareSelected: mockSetShareSelected,
    handleCopyToClipboard: mockHandleCopyToClipboard,
    setShareAoi: mockSetShareAoi,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open is true', () => {
    render(<Share {...defaultProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    render(<Share {...defaultProps} open={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders share URL input when selected is link', () => {
    render(<Share {...defaultProps} selected="link" />);
    const input = screen.getByDisplayValue('https://example.com/share');
    expect(input).toBeInTheDocument();
  });

  it('renders embed code when selected is embed', () => {
    render(<Share {...defaultProps} selected="embed" />);
    const embedCode = screen.getByDisplayValue(
      /<iframe width="670" height="490"/
    );
    expect(embedCode).toBeInTheDocument();
  });

  it('calls handleCopyToClipboard when copy button is clicked', () => {
    render(<Share {...defaultProps} />);
    const copyButton = screen.getByText(/copy/i);
    fireEvent.click(copyButton);
    expect(mockHandleCopyToClipboard).toHaveBeenCalled();
  });

  it('shows public area toggle when area is provided and not public', () => {
    const area = { id: '123', public: false };
    render(<Share {...defaultProps} area={area} />);
    expect(screen.getByText(/make this area public/i)).toBeInTheDocument();
  });

  it('does not show public area toggle when area is public', () => {
    const area = { id: '123', public: true };
    render(<Share {...defaultProps} area={area} />);
    expect(
      screen.queryByText(/make this area public/i)
    ).not.toBeInTheDocument();
  });

  it('calls setShareAoi when public area is toggled', () => {
    const area = { id: '123', public: false };
    render(<Share {...defaultProps} area={area} />);
    const toggle = screen.getByText(/make this area public/i);
    fireEvent.click(toggle);
    expect(mockSetShareAoi).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Share {...defaultProps} loading />);
    // Loading state should be handled by Loader component
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('shows copied state', () => {
    render(<Share {...defaultProps} copied />);
    expect(screen.getByText(/copied/i)).toBeInTheDocument();
  });
});
