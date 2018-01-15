import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WidgetChartToolTip from 'pages/country/widget/components/widget-chart-tooltip';
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
    const { data, xKey, yKey, className } = this.props;
    const { tooltip, color } = this.props.config;

    return (
      <div className={`c-bar-chart ${className}`}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 15, right: 0, left: -15, bottom: 0 }}
          >
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ dy: 8, fontSize: '12px' }}
              tickFormatter={tick => moment(tick, 'YYYY').format('YY')}
            />
            <YAxis
              dataKey={yKey}
              axisLine={false}
              tickLine={false}
              tickFormatter={tick => (tick ? format('.3s')(tick) : 0)}
              tick={{ fontSize: '12px' }}
            />
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <Tooltip content={<WidgetChartToolTip settings={tooltip} />} />
            <Bar dataKey={yKey} barSize={22} fill={color} background={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

WidgetBarChart.propTypes = {
  data: PropTypes.array,
  xKey: PropTypes.string,
  yKey: PropTypes.string,
  className: PropTypes.string,
  config: PropTypes.object
};

WidgetBarChart.defaultProps = {
  config: {
    tooltip: [{ key: 'value', unit: null }],
    color: '#fe6598'
  }
};

export default WidgetBarChart;
