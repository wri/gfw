import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ChartToolTip from '../components/chart-tooltip';

import './pie-chart-styles.scss';

class CustomPieChart extends PureComponent {
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
        <ResponsiveContainer width="99%" height={maxSize}>
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
              content={
                <ChartToolTip
                  settings={[
                    {
                      key: 'percentage',
                      label: 'label',
                      unit: '%',
                      unitFormat: value => format('.1f')(value)
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

CustomPieChart.propTypes = {
  data: PropTypes.array,
  maxSize: PropTypes.number,
  dataKey: PropTypes.string,
  innerRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  outerRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  className: PropTypes.string
};

CustomPieChart.defaultProps = {
  maxSize: 300,
  dataKey: 'value',
  innerRadius: '50%',
  outerRadius: '100%',
  startAngle: -270,
  endAngle: -630
};

export default CustomPieChart;
