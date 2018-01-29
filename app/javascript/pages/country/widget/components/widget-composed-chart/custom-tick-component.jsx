import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

const CustomTick = ({ x, y, payload, dataMax, unit, fill }) => {
  const tickValue = payload && payload.value;
  const formattedTick = tickValue ? format('.2s')(tickValue) : 0;
  const tick = tickValue >= dataMax ? `${formattedTick}${unit}` : formattedTick;

  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <filter x="0" y="0" width="1" height="1" id="solid">
          <feFlood floodColor="white" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <text
        filter="url(#solid)"
        x="0"
        y="3"
        textAnchor="start"
        fontSize="12px"
        fill={fill}
      >
        {tick}
      </text>
    </g>
  );
};

CustomTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
  dataMax: PropTypes.number,
  unit: PropTypes.string,
  fill: PropTypes.string
};

export default CustomTick;
