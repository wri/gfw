import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WidgetChartToolTip from 'pages/country/widget/components/widget-chart-tooltip';
import maxBy from 'lodash/maxBy';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'd3-format';
import moment from 'moment';

import './widget-bar-chart-styles.scss';

class WidgetBarChart extends PureComponent {
  render() {
    const { data, xKey, yKeys, className } = this.props;
    const { tooltip, colors, unit } = this.props.config;
    const dataMax = maxBy(data, yKeys[yKeys.length - 1])[
      yKeys[yKeys.length - 1]
    ];

    return (
      <div className={`c-bar-chart ${className}`}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 15, right: 0, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ dy: 8, fontSize: '12px' }}
              tickFormatter={tick => moment(tick, 'YYYY').format('YY')}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={tick => {
                const formattedTick = tick ? format('.2s')(tick) : 0;
                return tick >= dataMax
                  ? `${formattedTick}${unit}`
                  : formattedTick;
              }}
              tick={{ fontSize: '12px' }}
            />
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <Tooltip content={<WidgetChartToolTip settings={tooltip} />} />
            {yKeys.map(key => (
              <Bar
                key={key}
                dataKey={key}
                stackId={1}
                fill={colors[key]}
                background={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

WidgetBarChart.propTypes = {
  data: PropTypes.array,
  xKey: PropTypes.string,
  yKeys: PropTypes.array,
  className: PropTypes.string,
  config: PropTypes.object
};

WidgetBarChart.defaultProps = {
  config: {
    tooltip: [{ key: 'value', unit: null }]
  }
};

export default WidgetBarChart;
