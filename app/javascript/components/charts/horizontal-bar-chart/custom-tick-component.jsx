import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import Link from 'redux-first-router-link';

const CustomTick = ({ x, y, index, yAxisDotFill, data, settings }) => {
  const { region, path, rank, total, extLink } = data[index];
  const { page, pageSize } = settings;
  const number = rank || index + 1 + pageSize * page;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="-16" cy="-20" r="12" fill={yAxisDotFill} />
      <text
        x={number > 9 ? '-22' : '-19'}
        y="-16"
        textAnchor="start"
        fontSize="12px"
        fill="#FFFFFF"
      >
        {number}
      </text>
      <text x="8" y="-16" textAnchor="start" fontSize="12px" fill="#555555">
        {extLink ? (
          <a href={path} target="_blank" rel="noopener noreferrer">
            {region} -
            {formatNumber({ num: total, unit: '%' })}
            {index === 0 ? ' are plantations' : ''}
          </a>
        ) : (
          <Link to={path}>
            {region} -
            {formatNumber({ num: total, unit: '%' })}
            {index === 0 ? ' are plantations' : ''}
          </Link>
        )}
      </text>
    </g>
  );
};

CustomTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  index: PropTypes.number,
  yAxisDotFill: PropTypes.string,
  data: PropTypes.array,
  settings: PropTypes.object
};

export default CustomTick;
