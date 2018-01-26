import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WidgetChartToolTip from 'pages/country/widget/components/widget-chart-tooltip';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';

import {
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import moment from 'moment';

import CustomTick from './custom-tick-component';
import './widget-glad-alerts-chart-styles.scss';

class WidgetGladAlertsChart extends PureComponent {
  render() {
    const { data, className } = this.props;
    const { tooltip, colors, opacity, unit, xKey, yKeys } = this.props.config;
    const { lineKeys, barKeys, areaKeys } = yKeys;
    const maxValues = [];
    Object.keys(yKeys).forEach(key => {
      const keys = yKeys[key];
      maxValues.push(maxBy(data, keys[keys.length - 1])[keys[keys.length - 1]]);
    });
    const dataMax = max(maxValues);

    return (
      <div className={`c-glad-alerts-chart ${className}`}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 15, right: 0, left: 42, bottom: 0 }}
            padding={{ left: 50 }}
          >
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tickCount={12}
              interval={4}
              tick={{ dy: 8, fontSize: '12px', fill: '#555555' }}
              tickFormatter={t => moment(t).format('MMM')}
            />
            <YAxis
              type="number"
              axisLine={false}
              strokeDasharray="3 4"
              tickSize={-42}
              domain={[0, 'auto']}
              allowDataOverflow
              mirror
              tickMargin={0}
              tick={
                <CustomTick
                  dataMax={dataMax}
                  unit={unit || ''}
                  fill="#555555"
                />
              }
            />
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <Tooltip
              cursor={{ fill: '#d6d6d9' }}
              content={
                <WidgetChartToolTip settings={tooltip} colors={colors} />
              }
            />
            {areaKeys &&
              areaKeys.map(key => (
                <Area
                  type="monotone"
                  key={key}
                  dataKey={key}
                  fill={colors[key]}
                  stroke={colors[key]}
                  opacity={opacity[key]}
                  strokeWidth={0}
                  background={false}
                  dot={false}
                  activeDot={false}
                />
              ))}
            {lineKeys &&
              lineKeys.map(key => (
                <Line
                  key={key}
                  dataKey={key}
                  stroke={colors[key]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            {barKeys &&
              barKeys.map(key => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[key]}
                  background={false}
                  dot={false}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

WidgetGladAlertsChart.propTypes = {
  data: PropTypes.array,
  xKey: PropTypes.string,
  yKeys: PropTypes.array,
  className: PropTypes.string,
  config: PropTypes.object
};

WidgetGladAlertsChart.defaultProps = {
  config: {
    tooltip: [{ key: 'value', unit: null }]
  }
};

export default WidgetGladAlertsChart;
