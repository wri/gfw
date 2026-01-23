/**
 * Mock for Recharts library
 * Provides mock implementations for Recharts components
 */

import React from 'react';

// Mock chart components
export const ResponsiveContainer = ({ children, ...props }) => (
  <div data-testid="responsive-container" {...props}>
    {children}
  </div>
);

export const ComposedChart = ({ children, ...props }) => (
  <div data-testid="composed-chart" {...props}>
    {children}
  </div>
);

export const BarChart = ({ children, ...props }) => (
  <div data-testid="bar-chart" {...props}>
    {children}
  </div>
);

export const LineChart = ({ children, ...props }) => (
  <div data-testid="line-chart" {...props}>
    {children}
  </div>
);

export const PieChart = ({ children, ...props }) => (
  <div data-testid="pie-chart" {...props}>
    {children}
  </div>
);

export const AreaChart = ({ children, ...props }) => (
  <div data-testid="area-chart" {...props}>
    {children}
  </div>
);

export const Bar = ({ ...props }) => <div data-testid="bar" {...props} />;
export const Line = ({ ...props }) => <div data-testid="line" {...props} />;
export const Area = ({ ...props }) => <div data-testid="area" {...props} />;
export const Pie = ({ ...props }) => <div data-testid="pie" {...props} />;
export const Cell = ({ ...props }) => <div data-testid="cell" {...props} />;
export const XAxis = ({ ...props }) => <div data-testid="x-axis" {...props} />;
export const YAxis = ({ ...props }) => <div data-testid="y-axis" {...props} />;
export const CartesianGrid = ({ ...props }) => (
  <div data-testid="cartesian-grid" {...props} />
);
export const Tooltip = ({ ...props }) => (
  <div data-testid="tooltip" {...props} />
);
export const Legend = ({ ...props }) => (
  <div data-testid="legend" {...props} />
);
export const ReferenceLine = ({ ...props }) => (
  <div data-testid="reference-line" {...props} />
);
export const Brush = ({ ...props }) => <div data-testid="brush" {...props} />;

export default {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  Bar,
  Line,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
};
