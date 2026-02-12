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

jest.mock('rehype-raw', () => ({
  __esModule: true,
  default: () => (tree) => tree,
}));

jest.mock('@worldresources/gfw-components', () => ({
  // eslint-disable-next-line react/prop-types
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  NoContent: () => <div>No content</div>,
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
    render(
      <ModalMeta {...defaultProps} metakey="test-key" metaType="dataset" />
    );
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

  it('renders modal when metakey is provided and metaData is available', () => {
    const metaData = {
      title: 'Test Dataset',
      overview: 'Test overview',
    };

    render(
      <ModalMeta {...defaultProps} metakey="test-key" metaData={metaData} />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('renders loading state when metakey is provided', () => {
    render(<ModalMeta {...defaultProps} metakey="test-key" loading />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('renders error state when metakey is provided', () => {
    render(<ModalMeta {...defaultProps} metakey="test-key" error />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
