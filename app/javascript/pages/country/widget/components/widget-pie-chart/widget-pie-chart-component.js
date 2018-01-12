import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import WidgetChartToolTip from 'pages/country/widget/components/widget-chart-tooltip';

import './widget-pie-chart-styles.scss';

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
      startAngle,
      endAngle,
      className
    } = this.props;

    return (
      <div className={`c-pie-chart ${className}`}>
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            dataKey={dataKey}
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
          >
            {data.map((item, index) => (
              <Cell key={index.toString()} fill={item.color} strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            content={
              <WidgetChartToolTip
                settings={[
                  {
                    key: 'percentage',
                    unit: '%',
                    label: true
                  }
                ]}
              />
            }
          />
        </PieChart>
      </div>
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
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  className: PropTypes.string
};

WidgetPieChart.defaultProps = {
  width: 123,
  height: 123,
  dataKey: 'value',
  cx: 56,
  cy: 56,
  innerRadius: 28,
  outerRadius: 60,
  startAngle: 90,
  endAngle: 450
};

export default WidgetPieChart;
