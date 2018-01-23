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
import moment from 'moment';

import CustomTick from './custom-tick-component';
import './widget-bar-chart-styles.scss';

class WidgetBarChart extends PureComponent {
  render() {
    const { layout, data, xKey, yKeys, className } = this.props;
    const { tooltip, colors, unit } = this.props.config;
    const dataMax = maxBy(data, yKeys[yKeys.length - 1])[
      yKeys[yKeys.length - 1]
    ];

    const xAxisConfig = {
      dataKey: xKey,
      axisLine: false,
      tickLine: false,
      tick: { dy: 8, fontSize: '12px', fill: '#555555' },
      tickFormatter: tick => moment(tick, 'YYYY').format('YY')
    };

    const yAxisConfig = {
      axisLine: false,
      strokeDasharray: '3 4',
      tickSize: -42,
      mirror: true,
      tickMargin: 0,
      tick: <CustomTick dataMax={dataMax} unit={unit} fill="#555555" />
    };

    return (
      <div className={`c-bar-chart ${className}`}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 15, right: 0, left: 42, bottom: 0 }}
            padding={{ left: 50 }}
            layout={layout}
          >
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <Tooltip
              content={
                <WidgetChartToolTip settings={tooltip} colors={colors} />
              }
            />
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
  layout: PropTypes.string,
  data: PropTypes.array,
  xKey: PropTypes.string,
  yKeys: PropTypes.array,
  className: PropTypes.string,
  config: PropTypes.object
};

WidgetBarChart.defaultProps = {
  layout: 'horizontal',
  config: {
    tooltip: [{ key: 'value', unit: null }]
  }
};

export default WidgetBarChart;
