import React from 'react';
import { render, screen } from '@testing-library/react';
import ModalMeta from '../component';

jest.mock('components/modal', () => ({
  __esModule: true,
  default: ({ children, open }) =>
    open ? <div data-testid="modal">{children}</div> : null,
}));

jest.mock('utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe('ModalMeta', () => {
  const mockGetModalMetaData = jest.fn();
  const mockSetModalMetaClosed = jest.fn();

  const defaultProps = {
    getModalMetaData: mockGetModalMetaData,
    setModalMetaClosed: mockSetModalMetaClosed,
    loading: false,
    error: false,
    metaData: null,
    tableData: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getModalMetaData on mount when metakey is provided', () => {
    render(<ModalMeta {...defaultProps} metakey="test-key" metaType="dataset" />);
    expect(mockGetModalMetaData).toHaveBeenCalledWith({
      metakey: 'test-key',
      metaType: 'dataset',
    });
  });

  it('does not call getModalMetaData when metakey is not provided', () => {
    render(<ModalMeta {...defaultProps} />);
    expect(mockGetModalMetaData).not.toHaveBeenCalled();
  });

  it('calls getModalMetaData when metakey changes', () => {
    const { rerender } = render(
      <ModalMeta {...defaultProps} metakey="key1" metaType="dataset" />
    );

    rerender(<ModalMeta {...defaultProps} metakey="key2" metaType="dataset" />);

    expect(mockGetModalMetaData).toHaveBeenCalledTimes(2);
    expect(mockGetModalMetaData).toHaveBeenLastCalledWith({
      metakey: 'key2',
      metaType: 'dataset',
    });
  });

  it('renders modal when metaData is available', () => {
    const metaData = {
      title: 'Test Dataset',
      overview: 'Test overview',
    };

    render(<ModalMeta {...defaultProps} metaData={metaData} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<ModalMeta {...defaultProps} loading />);
    // Loading should be handled by Loader component
    expect(screen.queryByTestId('modal')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<ModalMeta {...defaultProps} error />);
    expect(screen.queryByTestId('modal')).toBeInTheDocument();
  });
});
