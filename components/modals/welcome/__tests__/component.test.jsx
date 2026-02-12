import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalWelcome from '../component';

jest.mock('components/modal', () => ({
  __esModule: true,
  default: ({ children, open }) =>
    open ? <div data-testid="modal">{children}</div> : null,
}));

jest.mock('utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

describe('ModalWelcome', () => {
  const mockSetModalWelcome = jest.fn();
  const mockSetMapSettings = jest.fn();
  const mockSetMenuSettings = jest.fn();
  const mockSetMainMapSettings = jest.fn();
  const mockSetMapPromptsSettings = jest.fn();
  const mockSetShowMapPrompts = jest.fn();

  const defaultProps = {
    open: true,
    setModalWelcome: mockSetModalWelcome,
    setMapSettings: mockSetMapSettings,
    setMenuSettings: mockSetMenuSettings,
    setMainMapSettings: mockSetMainMapSettings,
    setMapPromptsSettings: mockSetMapPromptsSettings,
    setShowMapPrompts: mockSetShowMapPrompts,
    description: 'Welcome to Global Forest Watch',
    welcomeCards: [],
    showPrompts: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open is true', () => {
    render(<ModalWelcome {...defaultProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    render(<ModalWelcome {...defaultProps} open={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ModalWelcome {...defaultProps} />);
    expect(screen.getByText('Welcome to Global Forest Watch')).toBeInTheDocument();
  });

  it('renders welcome cards when provided', () => {
    const welcomeCards = [
      {
        label: 'Card 1',
        thumbnail: 'thumb1.jpg',
        map: { center: [0, 0] },
      },
      {
        label: 'Card 2',
        thumbnail: 'thumb2.jpg',
      },
    ];

    render(<ModalWelcome {...defaultProps} welcomeCards={welcomeCards} />);
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('calls setModalWelcome when card is clicked', () => {
    const welcomeCards = [
      {
        label: 'Card 1',
        thumbnail: 'thumb1.jpg',
      },
    ];

    render(<ModalWelcome {...defaultProps} welcomeCards={welcomeCards} />);
    const cardButton = screen.getByText('Card 1');
    fireEvent.click(cardButton);

    expect(mockSetModalWelcome).toHaveBeenCalledWith(false);
  });

  it('calls setMapSettings when card has map config', () => {
    const welcomeCards = [
      {
        label: 'Card 1',
        thumbnail: 'thumb1.jpg',
        map: { center: [0, 0], zoom: 5 },
      },
    ];

    render(<ModalWelcome {...defaultProps} welcomeCards={welcomeCards} />);
    const cardButton = screen.getByText('Card 1');
    fireEvent.click(cardButton);

    expect(mockSetMapSettings).toHaveBeenCalledWith({ center: [0, 0], zoom: 5 });
  });

  it('calls setMapPromptsSettings when card has promptKey', () => {
    const welcomeCards = [
      {
        label: 'Card 1',
        thumbnail: 'thumb1.jpg',
        promptKey: 'test-prompt',
      },
    ];

    render(<ModalWelcome {...defaultProps} welcomeCards={welcomeCards} />);
    const cardButton = screen.getByText('Card 1');
    fireEvent.click(cardButton);

    expect(mockSetMapPromptsSettings).toHaveBeenCalledWith({
      open: true,
      stepsKey: 'test-prompt',
      stepIndex: 0,
      force: true,
    });
  });

  it('renders checkbox to hide welcome modal', () => {
    const { container } = render(<ModalWelcome {...defaultProps} />);
    const checkbox = container.querySelector('.c-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText('Show me tips')).toBeInTheDocument();
  });
});
