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
  ComposedChart,
  LabelList,
  Legend,
} from 'recharts';

import AxisLabel from './axis-label';

import ChartToolTip from '../components/chart-tooltip';
import CustomTick from './custom-tick-component';
import CustomBackground from './custom-background-component';

const XAxisTickWithoutGap = ({ x, y, payload }) => {
  const { offset, value } = payload;
  const lastPercentageFromData = 90;

  const Tick = () => (
    <g transform={`translate(${x - offset + 6},${y})`}>
      <text fontSize="12px" x={0} y={0} dy={16} textAnchor="end" fill="#555555">
        {value}
      </text>
    </g>
  );

  const ExtraTick = () => (
    <g transform={`translate(${x + offset + 6},${y})`}>
      <text fontSize="12px" x={0} y={0} dy={16} textAnchor="end" fill="#555555">
        100
      </text>
    </g>
  );

  /*
    Work around to show number 100 in the end of X axis in the chart
    since the Data API sends 0 to 90 percent in the tree cover density widget
    0 stands to 0%-9% as 90 stands to 90%-99%
  */
  return value === lastPercentageFromData ? (
    <>
      <Tick />
      <ExtraTick />
    </>
  ) : (
    <Tick />
  );
};

class CustomComposedChart extends PureComponent {
  findMaxValue = (data, config) => {
    const { yKeys } = config || {};
    const maxValues = [];
    if (yKeys) {
      Object.keys(yKeys).forEach((key) => {
        Object.keys(yKeys[key]).forEach((subKey) => {
          const maxValue =
            yKeys[key][subKey].stackId === 1
              ? // Total sum of values if graph is a stacked bar chart
                {
                  [subKey]: max(
                    data.map((d) =>
                      Object.keys(yKeys[key]).reduce((acc, k) => acc + d[k], 0)
                    )
                  ),
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

  renderDecoration = (decoration, x, y, width) => {
    if (decoration === 'star') {
      return (
        <path
          transform={`translate(${
            // TODO: should be more elegant
            x + width / 2 - 10 / 2
          }, ${y - 32 * 0.3 - 6}) scale(0.3)`}
          d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"
        />
      );
    }
    return null;
  };

  renderLabel = (props, data) => {
    const { x, y, width, index } = props;
    const yearIndex = data
      .map((i, iIndex) => ({ ...i, index: iIndex }))
      .filter((a) => a.decoration);

    return (
      <g>
        {yearIndex.map(
          (starInYear) =>
            starInYear.index === index &&
            this.renderDecoration(
              data[starInYear.index].decoration,
              x,
              y,
              width
            )
        )}
      </g>
    );
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
      barBackground,
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
      tooltipParseData,
      unit,
      unitFormat,
      height,
      margin,
      stackOffset,
      referenceLine,
      simpleNeedsAxis = false,
      simpleLegend,
    } = config;

    const isVertical = !!xKeys;
    const dataKeys = yKeys || xKeys;
    const { lines, bars, areas } = dataKeys;
    const maxYValue = this.findMaxValue(data, config);
    let rightMargin = 0;
    if (isVertical) rightMargin = 10;
    if (!simple && rightYAxis) rightMargin = 70;

    const DEFAULT_BAR_GAP = '10%'; // default is 10% according to recharts docs
    const { barGap = DEFAULT_BAR_GAP } = xAxis || {};
    const hasLabels = xAxis?.label || yAxis?.label;

    return (
      <div
        className={cx('c-composed-chart', className, {
          'overflow-x-visible': hasLabels,
          'no-padding': simple,
        })}
        style={{
          height: simple ? 110 : height || 250,
          paddingLeft: config?.yAxis?.label ? '3%' : '0',
        }}
      >
        <ResponsiveContainer width="99%">
          <ComposedChart
            barCategoryGap={barGap || DEFAULT_BAR_GAP}
            data={data}
            margin={
              margin || {
                top: !simple ? 15 : 0,
                right: rightMargin,
                left: simple || isVertical ? 0 : 42,
                bottom: 0,
              }
            }
            stackOffset={!!stackOffset && stackOffset}
            padding={{ left: 50 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            layout={isVertical ? 'vertical' : 'horizontal'}
          >
            <defs>
              {gradients &&
                Object.keys(gradients).map((key) => (
                  <linearGradient
                    key={`lg_${key}`}
                    {...gradients[key].attributes}
                  >
                    {gradients[key].stops &&
                      Object.keys(gradients[key].stops).map((sKey) => (
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
              tick={
                barGap !== DEFAULT_BAR_GAP ? (
                  <XAxisTickWithoutGap />
                ) : (
                  {
                    dy: 8,
                    fontSize: simple ? '10px' : '12px',
                    fill: '#555555',
                  }
                )
              }
              interval="preserveStartEnd"
              {...xAxis}
              {...(config?.xAxis?.label && {
                label: (
                  <AxisLabel
                    label={config?.xAxis?.label}
                    direction="x"
                    isSimple={simple}
                  />
                ),
              })}
            />
            {(!simple || simpleNeedsAxis) && (
              <YAxis
                dataKey={yKey || ''}
                tickLine={!isVertical}
                axisLine={false}
                {...(!isVertical
                  ? {
                      strokeDasharray: '3 4',
                      tickSize: -42,
                      mirror: true,
                      tickMargin: 0,
                    }
                  : {})}
                tick={(
                  <CustomTick
                    dataMax={maxYValue}
                    unit={unit || ''}
                    unitFormat={
                      unitFormat ||
                      ((value) =>
                        value < 1 ? format('.2r')(value) : format('.2s')(value))
                    }
                    fill="#555555"
                    vertical={isVertical}
                  />
                )}
                {...yAxis}
                {...(config?.yAxis?.label && {
                  label: <AxisLabel label={config.yAxis.label} direction="y" />,
                })}
              />
            )}
            {(!simple || simpleNeedsAxis) && rightYAxis && (
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
                      tickMargin: 0,
                    }
                  : {})}
                tick={(
                  <CustomTick
                    dataMax={rightYAxis.maxYValue || maxYValue}
                    unit={rightYAxis.unit || unit || ''}
                    unitFormat={
                      unitFormat ||
                      ((value) =>
                        value < 1 ? format('.2r')(value) : format('.2s')(value))
                    }
                    fill="#555555"
                    vertical={isVertical}
                  />
                )}
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

            {simpleLegend && (
              <Legend
                iconSize={5}
                verticalAlign="top"
                payload={simpleLegend}
                wrapperStyle={{
                  fontSize: 10,
                }}
              />
            )}

            <Tooltip
              simple={simple}
              offset={100}
              cursor={{
                opacity: 0.5,
                stroke: '#d6d6d9',
                ...(!!bars && {
                  strokeWidth: `${
                    1.2 * ((isVertical ? 45 : 100) / data.length)
                  }%`,
                }),
              }}
              content={
                <ChartToolTip settings={tooltip} parseData={tooltipParseData} />
              }
            />
            {bars &&
              Object.keys(bars).map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  dot={false}
                  background={(d) =>
                    barBackground && (
                      <CustomBackground
                        {...d}
                        activeIndex={barBackground.activeIndex}
                      />
                    )}
                  {...bars[key]}
                >
                  {bars[key].labelList && (
                    <LabelList key={key} {...bars[key].labelList}>
                      {bars[key].labelList.value}
                    </LabelList>
                  )}
                  <LabelList
                    key="test"
                    position="top"
                    content={(props) => this.renderLabel(props, data)}
                  />
                  {bars[key].itemColor &&
                    data.map((item) => (
                      <Cell key={`c_${item.color}`} fill={item.color} />
                    ))}
                </Bar>
              ))}
            {referenceLine && <ReferenceLine {...referenceLine} />}
            {areas &&
              Object.keys(areas).map((key) => (
                <Area key={key} dataKey={key} dot={false} {...areas[key]} />
              ))}
            {lines &&
              Object.keys(lines).map((key) => (
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
  barBackground: PropTypes.object,
};

XAxisTickWithoutGap.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

export default CustomComposedChart;
