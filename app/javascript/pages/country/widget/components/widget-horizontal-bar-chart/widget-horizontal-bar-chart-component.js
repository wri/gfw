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

import CustomTick from './custom-tick-component';
import './widget-horizontal-bar-chart-styles.scss';

class WidgetBarChart extends PureComponent {
  render() {
    const { data, className } = this.props;
    const { tooltip, colors, yKeys, yAxisDotFill } = this.props.config;

    return (
      <div className={`c-horizontal-bar-chart ${className}`}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 15, right: 0, left: -32, bottom: 0 }}
            layout="vertical"
          >
            <Tooltip
              cursor={{ fill: '#d6d6d9' }}
              content={
                <WidgetChartToolTip
                  settings={tooltip}
                  colors={colors}
                  hideZeros
                />
              }
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: '12px', fill: '#555555' }}
              ticks={[0, 25, 50, 75, 100]}
            />
            <YAxis
              type="category"
              axisLine={false}
              tickLine={false}
              tick={<CustomTick data={data} yAxisDotFill={yAxisDotFill} />}
            />
            {Object.keys(data[0]).map(
              (key, index) =>
                (yKeys.indexOf(key) === -1 ? null : (
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
