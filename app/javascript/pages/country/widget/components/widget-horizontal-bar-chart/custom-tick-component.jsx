import React from 'react';
import PropTypes from 'prop-types';

const CustomTick = ({ x, y, index, yAxisDotFill, data }) => {
  const tick = index + 1;
  const { region, regionPath } = data[index];

  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="-12" cy="-18" r="8" fill={yAxisDotFill} />
      <text x="-15" y="-14" textAnchor="start" fontSize="12px" fill="#FFFFFF">
        {tick}
      </text>
      <text x="8" y="-16" textAnchor="start" fontSize="12px" fill="#555555">
        <a href={regionPath}>{region}</a>
      </text>
    </g>
  );
};

CustomTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  index: PropTypes.number,
  yAxisDotFill: PropTypes.string,
  data: PropTypes.array
};

export default CustomTick;
