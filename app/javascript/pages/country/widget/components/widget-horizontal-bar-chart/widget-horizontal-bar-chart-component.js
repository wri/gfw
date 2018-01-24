import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WidgetChartToolTip from 'pages/country/widget/components/widget-chart-tooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import './widget-horizontal-bar-chart-styles.scss';

class WidgetBarChart extends PureComponent {
  render() {
    const { data, className } = this.props;
    const { tooltip, colors } = this.props.config;

    return (
      <div className={`c-bar-chart ${className}`}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 15, right: 0, left: -45, bottom: 0 }}
            layout="vertical"
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: '12px', fill: '#555555' }}
            />
            <YAxis
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: '12px', fill: '#555555' }}
            />
            <Tooltip
              cursor={{ fill: '#d6d6d9' }}
              content={
                <WidgetChartToolTip settings={tooltip} colors={colors} />
              }
            />
            {Object.keys(data[0]).map(
              (key, index) =>
                (key.includes('label') ? null : (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId={1}
                    barSize={10}
                    fill={colors[key]}
                    background={!index ? { fill: '#e9e9ea' } : false}
                  />
                ))
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

WidgetBarChart.propTypes = {
  data: PropTypes.array,
  className: PropTypes.string,
  config: PropTypes.object
};

WidgetBarChart.defaultProps = {
  config: {
    tooltip: [{ key: 'value', unit: null }]
  }
};

export default WidgetBarChart;
