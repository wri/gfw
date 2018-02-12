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
import WidgetPaginate from 'pages/country/widget/components/widget-paginate';

import CustomTick from './custom-tick-component';
import './widget-horizontal-bar-chart-styles.scss';

class WidgetHorizontalBarChart extends PureComponent {
  render() {
    const { data, className, handlePageChange, settings } = this.props;
    const { tooltip, colors, yKeys, yAxisDotFill } = this.props.config;
    const { page, pageSize } = settings;
    const pageData = pageSize
      ? data.slice(page * pageSize, (page + 1) * pageSize)
      : data;

    return (
      <div className={`c-horizontal-bar-chart ${className}`}>
        <ResponsiveContainer>
          <BarChart
            data={pageData}
            margin={{ top: 15, right: 0, left: -24, bottom: 0 }}
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
              hide
              type="number"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <YAxis
              type="category"
              axisLine={false}
              tickLine={false}
              tick={
                <CustomTick
                  data={pageData}
                  yAxisDotFill={yAxisDotFill}
                  settings={settings}
                />
              }
            />
            {Object.keys(pageData[0]).map(
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
        {handlePageChange &&
          data.length > settings.pageSize && (
            <WidgetPaginate
              className="horizontal-pagintation"
              settings={settings}
              count={data.length}
              onClickChange={handlePageChange}
            />
          )}
      </div>
    );
  }
}

WidgetHorizontalBarChart.propTypes = {
  data: PropTypes.array,
  className: PropTypes.string,
  config: PropTypes.object,
  settings: PropTypes.object,
  handlePageChange: PropTypes.func
};

WidgetHorizontalBarChart.defaultProps = {
  config: {
    tooltip: [{ key: 'value', unit: null }]
  }
};

export default WidgetHorizontalBarChart;
