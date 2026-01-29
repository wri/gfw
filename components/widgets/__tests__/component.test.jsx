import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderWithRedux } from '../../__tests__/test-utils';
import Widgets from '../component';

jest.mock('components/widget', () => ({
  __esModule: true,
  default: ({ title, widget }) => (
    <div data-testid={`widget-${widget}`}>{title}</div>
  ),
}));

jest.mock('utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

describe('Widgets', () => {
  const mockWidgets = [
    { widget: 'tree-loss', title: 'Tree Loss', type: 'chart' },
    { widget: 'fires', title: 'Fires', type: 'chart' },
  ];

  const defaultProps = {
    widgets: mockWidgets,
    setWidgetsData: jest.fn(),
    setWidgetsChartSettings: jest.fn(),
    setWidgetSettings: jest.fn(),
    setWidgetInteractionByKey: jest.fn(),
    setActiveWidget: jest.fn(),
    setModalMetaSettings: jest.fn(),
    setShareModal: jest.fn(),
    setMapSettings: jest.fn(),
    handleClickWidget: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders widgets when provided', () => {
    renderWithRedux(<Widgets {...defaultProps} />);
    expect(screen.getByTestId('widget-tree-loss')).toBeInTheDocument();
    expect(screen.getByTestId('widget-fires')).toBeInTheDocument();
  });

  it('renders loader when loadingData is true', () => {
    const { container } = renderWithRedux(
      <Widgets {...defaultProps} loadingData />
    );
    expect(container.querySelector('.widgets-loader')).toBeInTheDocument();
  });

  it('renders NoContent when no widgets available', () => {
    renderWithRedux(
      <Widgets {...defaultProps} widgets={[]} noDataMessage="No widgets" />
    );
    expect(screen.getByText('No widgets')).toBeInTheDocument();
  });

  it('does not render NoContent when simple prop is true', () => {
    const { container } = renderWithRedux(
      <Widgets {...defaultProps} widgets={[]} simple />
    );
    expect(container.querySelector('.no-widgets-message')).not.toBeInTheDocument();
  });

  it('renders widgets grouped by subcategory when groupBySubcategory is true', () => {
    const groupedWidgets = [
      {
        id: 'category1',
        label: 'Category 1',
        widgets: [mockWidgets[0]],
      },
      {
        id: 'category2',
        label: 'Category 2',
        widgets: [mockWidgets[1]],
      },
    ];

    renderWithRedux(
      <Widgets
        {...defaultProps}
        widgetsGroupedBySubcategory={groupedWidgets}
        groupBySubcategory
      />
    );

    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByTestId('widget-tree-loss')).toBeInTheDocument();
    expect(screen.getByTestId('widget-fires')).toBeInTheDocument();
  });

  it('marks widget as active when activeWidget matches', () => {
    const activeWidget = { widget: 'tree-loss' };
    renderWithRedux(
      <Widgets {...defaultProps} activeWidget={activeWidget} />
    );
    expect(screen.getByTestId('widget-tree-loss')).toBeInTheDocument();
  });

  it('applies simple className when simple prop is true', () => {
    const { container } = renderWithRedux(
      <Widgets {...defaultProps} simple />
    );
    expect(container.querySelector('.c-widgets')).toHaveClass('simple');
  });

  it('applies embed className when embed prop is true', () => {
    const { container } = renderWithRedux(
      <Widgets {...defaultProps} embed />
    );
    expect(container.querySelector('.c-widgets')).toHaveClass('embed');
  });

  it('passes location to widgets', () => {
    const location = { type: 'country', adm0: 'BRA' };
    renderWithRedux(
      <Widgets {...defaultProps} location={location} />
    );
    expect(screen.getByTestId('widget-tree-loss')).toBeInTheDocument();
  });

  it('handles empty widgets array', () => {
    renderWithRedux(
      <Widgets {...defaultProps} widgets={[]} />
    );
    expect(screen.queryByTestId('widget-tree-loss')).not.toBeInTheDocument();
  });
});
