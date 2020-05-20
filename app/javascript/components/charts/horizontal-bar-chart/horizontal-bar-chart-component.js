import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Paginate from 'components/paginate';
import ChartToolTip from '../components/chart-tooltip';

import CustomTick from './custom-tick-component';
import './horizontal-bar-chart-styles.scss';

class HorizontalBarChart extends PureComponent {
  render() {
    const { data, className, handlePageChange, settings } = this.props;
    const { tooltip, colors, yKeys, yAxisDotFill } = this.props.config;
    const { page, pageSize } = settings;
    const pageData =
      pageSize && data && !!data.length
        ? data.slice(page * pageSize, (page + 1) * pageSize)
        : data;

    return (
      <div className={`c-horizontal-bar-chart ${className}`}>
        <ResponsiveContainer width="99%">
          <BarChart
            data={pageData}
            margin={{ top: 15, right: 0, left: -24, bottom: 0 }}
            layout="vertical"
          >
            <Tooltip
              cursor={{ fill: '#d6d6d9' }}
              content={
                <ChartToolTip settings={tooltip} colors={colors} hideZeros />
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
            {pageData &&
              pageData.length &&
              Object.keys(pageData[0]).map(
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
          data &&
          data.length > settings.pageSize && (
          <Paginate
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

HorizontalBarChart.propTypes = {
  data: PropTypes.array,
  className: PropTypes.string,
  config: PropTypes.object,
  settings: PropTypes.object,
  handlePageChange: PropTypes.func
};

HorizontalBarChart.defaultProps = {
  config: {
    tooltip: [{ key: 'value', unit: null }]
  }
};

export default HorizontalBarChart;
