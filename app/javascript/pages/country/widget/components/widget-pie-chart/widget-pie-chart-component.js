import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import WidgetChartToolTip from 'pages/country/widget/components/widget-chart-tooltip';

import './widget-pie-chart-styles.scss';

class WidgetPieChart extends PureComponent {
  render() {
    const {
      data,
      maxSize,
      dataKey,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      className
    } = this.props;

    return (
      <div className={`c-pie-chart ${className}`}>
        <ResponsiveContainer width="100%" height={maxSize}>
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
                  // strokeWidth={0}
                  stroke={item.color}
                />
              ))}
            </Pie>
            <Tooltip
              content={
                <WidgetChartToolTip
                  settings={[
                    {
                      key: 'percentage',
                      unit: '%',
                      label: 'label'
                    }
                  ]}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

WidgetPieChart.propTypes = {
  data: PropTypes.array,
  maxSize: PropTypes.number,
  dataKey: PropTypes.string,
  innerRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  outerRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  className: PropTypes.string
};

WidgetPieChart.defaultProps = {
  maxSize: 300,
  dataKey: 'value',
  innerRadius: '50%',
  outerRadius: '100%',
  startAngle: 90,
  endAngle: 450
};

export default WidgetPieChart;
