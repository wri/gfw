import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { formatCurrency } from 'utils/format';

const CustomTick = ({
  x,
  y,
  payload,
  dataMax,
  unit,
  fill,
  backgroundColor
}) => {
  const tickValue = payload && payload.value;
  let formattedTick = 0;
  let tick = '';

  switch (unit) {
    case 'net_usd':
      formattedTick = tickValue ? formatCurrency(tickValue) : 0;
      tick = tickValue >= dataMax ? `${formattedTick} $` : formattedTick;
      break;
    default:
      formattedTick = tickValue ? format('.2s')(tickValue) : 0;
      tick = tickValue >= dataMax ? `${formattedTick}${unit}` : formattedTick;
      break;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <filter x="0" y="0" width="1" height="1" id="solid">
          <feFlood floodColor={backgroundColor || '#fff'} />
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
  fill: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default CustomTick;
