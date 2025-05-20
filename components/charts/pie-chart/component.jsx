import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import cx from 'classnames';
import ChartToolTip from '../components/chart-tooltip';

class CustomPieChart extends PureComponent {
  render() {
    const {
      data,
      // eslint-disable-next-line no-unused-vars
      maxSize,
      dataKey,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      className,
      tooltip,
      simple,
      chartSettings = {},
    } = this.props;

    const { chart } = chartSettings;

    return (
      <div className={cx('c-pie-chart', className)} style={chart?.style}>
        <ResponsiveContainer height={230}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={startAngle}
              endAngle={endAngle}
            >
              {data.map((item, index) => (
                <Cell
                  key={index.toString()}
                  fill={item.color}
                  stroke={item.color}
                />
              ))}
            </Pie>
            <Tooltip
              content={<ChartToolTip settings={tooltip} simple={simple} />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

CustomPieChart.propTypes = {
  data: PropTypes.array,
  maxSize: PropTypes.number,
  dataKey: PropTypes.string,
  innerRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  outerRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  className: PropTypes.string,
  simple: PropTypes.bool,
  tooltip: PropTypes.array,
  chartSettings: PropTypes.object,
};

CustomPieChart.defaultProps = {
  maxSize: 300,
  dataKey: 'value',
  innerRadius: '50%',
  outerRadius: '100%',
  startAngle: -270,
  endAngle: -630,
};

export default CustomPieChart;
