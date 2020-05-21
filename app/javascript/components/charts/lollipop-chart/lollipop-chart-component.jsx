import React, { PureComponent } from 'react';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

import { formatNumber } from 'utils/format';
import { SCREEN_M } from 'utils/constants';

import './lollipop-chart-styles.scss';
import CustomTick from './custom-tick-component';

const LollipopBar = props => {
  const { color, className, x, y, width, value, formatUnit } = props;
  const textX = value < 0 ? x + width - 45 : x + width + 15;

  return (
    <g>
      <Rectangle
        className={cx('recharts-bar-rectangle', className)}
        {...props}
        fill={color}
      />
      <circle cx={x + width} cy={y + 1} r="8" fill={color} />
      <text x={textX} y={y + 4} fill="#555">
        {formatNumber({
          num: value,
          unit: formatUnit
        })}
      </text>
    </g>
  );
};

LollipopBar.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  formatUnit: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  value: PropTypes.number
};

class LollipopChart extends PureComponent {
  render() {
    const { className, data, settings, settingsConfig } = this.props;
    const { unit } = settings;

    const unitsConfig = settingsConfig.find(conf => conf.key === 'unit');
    const selectedUnitConfig =
      unitsConfig &&
      unitsConfig.options &&
      unitsConfig.options.find(opt => opt.value === unit);
    let formatUnit = unit;
    if (selectedUnitConfig) {
      formatUnit =
        selectedUnitConfig.unit !== undefined
          ? selectedUnitConfig.unit
          : selectedUnitConfig.value;
    }

    const allNegative = !data.some(item => item.value > 0);
    let dataMax =
      data && data.reduce((acc, item) => Math.max(acc, item.value), 0);
    let dataMin =
      data && data.reduce((acc, item) => Math.min(acc, item.value), 0);
    dataMax = dataMax && dataMax > 0 ? dataMax : 0;
    dataMin = dataMin && dataMin < 0 ? dataMin : 0;

    let ticks = [dataMin, dataMin / 2, 0, dataMax / 2, dataMax];
    if (dataMin === 0) ticks = [0, dataMax * 0.33, dataMax * 0.66, dataMax];
    if (dataMax === 0) ticks = [dataMin, dataMin * 0.66, dataMin * 0.33, 0];

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className={cx('c-lollipop-chart', className)}>
            <div className="unit-legend">{`${unit
              .charAt(0)
              .toUpperCase()}${unit.slice(1)} (${formatUnit})`}</div>
            <ResponsiveContainer width="99%" height={32}>
              <BarChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                layout="vertical"
              >
                <XAxis
                  axisLine={{ stroke: '#333', strokeWidth: '1px' }}
                  orientation="top"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  ticks={ticks}
                  tickLine={false}
                  tickCount={5}
                  tickFormatter={num =>
                    (num === 0 ? '0' : formatNumber({ num }))
                  }
                  padding={{
                    left: isDesktop ? 220 : 20,
                    right: allNegative ? 8 : 45
                  }}
                />
                <YAxis
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  interval={0}
                />
              </BarChart>
            </ResponsiveContainer>
            <div
              className={cx(
                isDesktop
                  ? { 'chart-wrapper': data.length > 9 }
                  : { 'chart-wrapper': data.length > 4 }
              )}
            >
              <ResponsiveContainer
                width="99%"
                height={data.length * (isDesktop ? 40 : 70) + 60}
              >
                <BarChart
                  data={data}
                  margin={{ top: -30, right: 0, left: 0, bottom: 0 }}
                  layout="vertical"
                >
                  <CartesianGrid horizontal={false} vertical={isDesktop} />
                  <XAxis
                    axisLine={false}
                    orientation="top"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    ticks={ticks}
                    tickLine={false}
                    tickCount={5}
                    tickFormatter={() => ''}
                    padding={{
                      left: isDesktop ? 220 : 20,
                      right: allNegative ? 8 : 45
                    }}
                  />
                  <YAxis
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={props => (
                      <CustomTick
                        {...props}
                        data={data}
                        settings={settings}
                        isDesktop={isDesktop}
                      />
                    )}
                    interval={0}
                    padding={{
                      right: 0,
                      left: 0,
                      top: 0,
                      bottom: 0
                    }}
                  />
                  <Bar
                    dataKey="value"
                    barSize={2}
                    shape={props => (
                      <LollipopBar {...props} formatUnit={formatUnit} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </MediaQuery>
    );
  }
}

LollipopChart.propTypes = {
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.array,
  className: PropTypes.string
};

export default LollipopChart;
