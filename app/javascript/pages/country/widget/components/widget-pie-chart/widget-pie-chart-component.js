import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import WidgetTooltip from 'pages/country/widget/components/widget-tooltip';
import WidgetPieChartTooltip from './widget-pie-chart-tooltip-component';

// import './widget-pie-chart-styles.scss';

class WidgetPieChart extends PureComponent {
  render() {
    const {
      data,
      width,
      height,
      dataKey,
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle
    } = this.props;
    return (
      <PieChart width={width} height={height}>
        <Pie
          data={data}
          dataKey={dataKey}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
        >
          {data.map(
            (item, index) =>
              (item.value ? (
                <Cell key={index.toString()} fill={item.color} />
              ) : null)
          )}
        </Pie>
        <Tooltip
          percentageAndArea
          content={
            <WidgetTooltip>
              <WidgetPieChartTooltip data={data} />
            </WidgetTooltip>
          }
        />
      </PieChart>
    );
  }
}

WidgetPieChart.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  dataKey: PropTypes.string,
  cx: PropTypes.number,
  cy: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  startAngle: PropTypes.number
};

WidgetPieChart.defaultProps = {
  width: 120,
  height: 120,
  dataKey: 'value',
  cx: 56,
  cy: 56,
  innerRadius: 28,
  outerRadius: 60,
  startAngle: 0
};

export default WidgetPieChart;
