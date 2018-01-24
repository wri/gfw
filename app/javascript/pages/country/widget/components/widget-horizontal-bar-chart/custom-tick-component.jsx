import React from 'react';
import PropTypes from 'prop-types';

const CustomTick = ({ x, y, index, yAxisDotFill, data }) => {
  const tick = index + 1;
  const { region, path } = data[index];
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="-16" cy="-20" r="12" fill={yAxisDotFill} />
      <text x="-19" y="-16" textAnchor="start" fontSize="12px" fill="#FFFFFF">
        {tick}
      </text>
      <text x="8" y="-16" textAnchor="start" fontSize="12px" fill="#555555">
        <a href={path}>{region}</a>
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
