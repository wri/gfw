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
            margin={{ top: 15, right: 0, left: 0, bottom: 0 }}
            padding={{ top: 0, right: 0, left: 0, bottom: 0 }}
            layout="vertical"
          >
            <XAxis type="number" />
            <YAxis type="category" />
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <Tooltip
              cursor={{ fill: '#d6d6d9' }}
              content={
                <WidgetChartToolTip settings={tooltip} colors={colors} />
              }
            />
            {Object.keys(data[0]).map(key => (
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
