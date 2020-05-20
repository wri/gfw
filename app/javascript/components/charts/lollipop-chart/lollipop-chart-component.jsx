import React, { PureComponent } from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

import { formatNumber } from 'utils/format';

import './lollipop-chart-styles.scss';

const CustomTick = props => {
  const { x, y, index, data } = props;
  const { extLink, path, label } = data[index];

  const number = index + 1;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="-16" cy="-20" r="12" fill="#e5e5df" />
      <text
        x={number > 9 ? '-22' : '-19'}
        y="-16"
        textAnchor="start"
        fontSize="12px"
        fill="#555"
      >
        {number}
      </text>
      <text x="8" y="-16" textAnchor="start" fontSize="12px" fill="#555555">
        {extLink ? (
          <a href={path} target="_blank" rel="noopener nofollower">
            {label}
          </a>
        ) : (
          <Link to={path}>{label}</Link>
        )}
      </text>
    </g>
  );
};

CustomTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  index: PropTypes.number,
  data: PropTypes.array
};

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
      <circle cx={x + width} cy={y} r="8" fill={color} />
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

    return (
      <div className={cx('c-lollipop-chart', className)}>
        <div className="unit-legend">{`${unit
          .charAt(0)
          .toUpperCase()}${unit.slice(1)} (${formatUnit})`}</div>
        <ResponsiveContainer width="99%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 0, left: -24, bottom: 0 }}
            layout="vertical"
          >
            <XAxis
              orientation="top"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickCount={4}
              padding={{ left: 220, right: 45 }}
            />
            <YAxis
              type="category"
              axisLine={false}
              tickLine={false}
              tick={<CustomTick data={data} settings={settings} />}
              interval={0}
              padding={{ top: 50 }}
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
