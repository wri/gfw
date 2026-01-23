import React from 'react';
import { render } from '@testing-library/react';
import CustomPieChart from '../component';

// Mock recharts components
jest.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children, data, dataKey }) => (
    <div data-testid="pie" data-key={dataKey}>
      {children}
    </div>
  ),
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill} />,
  Tooltip: ({ content }) => <div data-testid="tooltip">{content}</div>,
  ResponsiveContainer: ({ children, height }) => (
    <div data-testid="responsive-container" data-height={height}>
      {children}
    </div>
  ),
}));

jest.mock('../../components/chart-tooltip', () => ({
  __esModule: true,
  default: () => <div data-testid="chart-tooltip">Tooltip</div>,
}));

describe('CustomPieChart', () => {
  const mockData = [
    { label: 'Category 1', value: 40, color: '#ff0000' },
    { label: 'Category 2', value: 60, color: '#00ff00' },
  ];

  it('renders pie chart with data', () => {
    const { getByTestId } = render(<CustomPieChart data={mockData} />);
    expect(getByTestId('pie-chart')).toBeInTheDocument();
    expect(getByTestId('pie')).toBeInTheDocument();
  });

  it('renders cells for each data item', () => {
    const { getAllByTestId } = render(<CustomPieChart data={mockData} />);
    const cells = getAllByTestId('cell');
    expect(cells).toHaveLength(2);
    expect(cells[0]).toHaveAttribute('data-fill', '#ff0000');
    expect(cells[1]).toHaveAttribute('data-fill', '#00ff00');
  });

  it('uses default dataKey', () => {
    const { getByTestId } = render(<CustomPieChart data={mockData} />);
    expect(getByTestId('pie')).toHaveAttribute('data-key', 'value');
  });

  it('uses custom dataKey when provided', () => {
    const { getByTestId } = render(
      <CustomPieChart data={mockData} dataKey="count" />
    );
    expect(getByTestId('pie')).toHaveAttribute('data-key', 'count');
  });

  it('applies custom className', () => {
    const { container } = render(
      <CustomPieChart data={mockData} className="custom-chart" />
    );
    expect(container.querySelector('.c-pie-chart')).toHaveClass('custom-chart');
  });

  it('renders tooltip', () => {
    const { getByTestId } = render(<CustomPieChart data={mockData} />);
    expect(getByTestId('tooltip')).toBeInTheDocument();
  });

  it('uses default height for ResponsiveContainer', () => {
    const { getByTestId } = render(<CustomPieChart data={mockData} />);
    expect(getByTestId('responsive-container')).toHaveAttribute(
      'data-height',
      '230'
    );
  });

  it('handles empty data array', () => {
    const { getByTestId } = render(<CustomPieChart data={[]} />);
    expect(getByTestId('pie-chart')).toBeInTheDocument();
  });
});
