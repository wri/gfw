import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import cx from 'classnames';
import {
  Line,
  Bar,
  Cell,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

import ChartToolTip from '../components/chart-tooltip';
import CustomTick from './custom-tick-component';
import CustomBackground from './custom-background-component';
import './styles.scss';

class CustomComposedChart extends PureComponent {
  findMaxValue = (data, config) => {
    const { yKeys } = config || {};
    const maxValues = [];
    if (yKeys) {
      Object.keys(yKeys).forEach(key => {
        Object.keys(yKeys[key]).forEach(subKey => {
          const maxValue =
            yKeys[key][subKey].stackId === 1
              ? // Total sum of values if graph is a stacked bar chart
              {
                [subKey]: max(
                  data.map(d =>
                    Object.keys(yKeys[key]).reduce((acc, k) => acc + d[k], 0)
                  )
                )
              }
              : maxBy(data, subKey);
          if (maxValue) {
            maxValues.push(maxValue[subKey]);
          }
        });
      });
      return max(maxValues);
    }

    return 0;
  };

  render() {
    const {
      className,
      data,
      config,
      simple,
      handleMouseMove,
      handleMouseLeave,
      handleClick,
      barBackground
    } = this.props;

    const {
      xKey,
      yKey,
      xKeys,
      yKeys,
      xAxis,
      yAxis,
      cartesianGrid,
      rightYAxis,
      gradients,
      tooltip,
      unit,
      unitFormat,
      height,
      margin,
      referenceLine
    } = config;

    const isVertical = !!xKeys;
    const dataKeys = yKeys || xKeys;
    const { lines, bars, areas } = dataKeys;
    const maxYValue = this.findMaxValue(data, config);
    let rightMargin = 0;
    if (isVertical) rightMargin = 10;
    if (!simple && rightYAxis) rightMargin = 70;

    return (
      <div
        className={cx('c-composed-chart', className)}
        style={{ height: simple ? 100 : height || 250 }}
      >
        <ResponsiveContainer width="99%">
          <ComposedChart
            data={data}
            margin={
              margin || {
                top: !simple ? 15 : 0,
                right: rightMargin,
                left: simple || isVertical ? 0 : 42,
                bottom: 0
              }
            }
            padding={{ left: 50 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            layout={isVertical ? 'vertical' : 'horizontal'}
          >
            <defs>
              {gradients &&
                Object.keys(gradients).map(key => (
                  <linearGradient
                    key={`lg_${key}`}
                    {...gradients[key].attributes}
                  >
                    {gradients[key].stops &&
                      Object.keys(gradients[key].stops).map(sKey => (
                        <stop
                          key={`st_${sKey}`}
                          {...gradients[key].stops[sKey]}
                        />
                      ))}
                  </linearGradient>
                ))}
            </defs>
            <XAxis
              dataKey={xKey || ''}
              axisLine={false}
              tickLine={false}
              tick={{
                dy: 8,
                fontSize: simple ? '10px' : '12px',
                fill: '#555555'
              }}
              interval="preserveStartEnd"
              {...xAxis}
            />
            {!simple && (
              <YAxis
                dataKey={yKey || ''}
                tickLine={!isVertical}
                axisLine={false}
                {...(!isVertical
                  ? {
                    strokeDasharray: '3 4',
                    tickSize: -42,
                    mirror: true,
                    tickMargin: 0
                  }
                  : {})}
                tick={
                  <CustomTick
                    dataMax={maxYValue}
                    unit={unit || ''}
                    unitFormat={
                      unitFormat ||
                      (value =>
                        (value < 1 ? format('.2r')(value) : format('.2s')(value)))
                    }
                    fill="#555555"
                    vertical={isVertical}
                  />
                }
                {...yAxis}
              />
            )}
            {!simple &&
              rightYAxis && (
              <YAxis
                orientation="right"
                dataKey={yKey || ''}
                tickLine={!isVertical}
                axisLine={false}
                {...(!isVertical
                  ? {
                    strokeDasharray: '3 4',
                    tickSize: -42,
                    mirror: true,
                    tickMargin: 0
                  }
                  : {})}
                tick={
                  <CustomTick
                    dataMax={rightYAxis.maxYValue || maxYValue}
                    unit={rightYAxis.unit || unit || ''}
                    unitFormat={
                      unitFormat ||
                        (value =>
                          (value < 1
                            ? format('.2r')(value)
                            : format('.2s')(value)))
                    }
                    fill="#555555"
                    vertical={isVertical}
                  />
                }
                {...rightYAxis}
              />
            )}
            {!simple && (
              <CartesianGrid
                vertical={isVertical}
                horizontal={!isVertical}
                strokeDasharray="3 4"
                {...cartesianGrid}
              />
            )}

            <Tooltip
              simple={simple}
              cursor={{
                opacity: 0.5,
                stroke: '#d6d6d9',
                ...(!!bars && {
                  strokeWidth: `${1.2 *
                    ((isVertical ? 45 : 100) / data.length)}%`
                })
              }}
              content={<ChartToolTip settings={tooltip} />}
            />
            {bars &&
              Object.keys(bars).map(key => (
                <Bar
                  key={key}
                  dataKey={key}
                  dot={false}
                  background={d =>
                    barBackground && (
                      <CustomBackground
                        {...d}
                        activeIndex={barBackground.activeIndex}
                      />
                    )
                  }
                  {...bars[key]}
                >
                  {bars[key].itemColor &&
                    data.map(item => (
                      <Cell key={`c_${item.color}`} fill={item.color} />
                    ))}
                </Bar>
              ))}
            {referenceLine && <ReferenceLine {...referenceLine} />}
            {areas &&
              Object.keys(areas).map(key => (
                <Area key={key} dataKey={key} dot={false} {...areas[key]} />
              ))}
            {lines &&
              Object.keys(lines).map(key => (
                <Line
                  key={key}
                  dataKey={key}
                  dot={false}
                  strokeWidth={2}
                  {...lines[key]}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

CustomComposedChart.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  className: PropTypes.string,
  simple: PropTypes.bool,
  handleMouseMove: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  handleClick: PropTypes.func,
  handleBrush: PropTypes.func,
  backgroundColor: PropTypes.string,
  barBackground: PropTypes.object
};

export default CustomComposedChart;
