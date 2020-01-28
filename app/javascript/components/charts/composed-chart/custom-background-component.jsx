import React from 'react';
import PropTypes from 'prop-types';

const CustomBackground = props => (
  <svg
    key={props.index}
    x={props.x}
    y={props.y - 3}
    width={props.width + 1}
    height={1.2 * props.height}
    viewBox={`0 0 ${props.width} ${props.height}`}
  >
    <g>
      <rect
        fill={props.index === props.activeIndex ? '#4a4a4a' : 'transparent'}
        opacity="0.1"
        x="-5"
        y="0"
        width={props.width + 5}
        height={1.2 * props.height}
      />
      {props.index === props.activeIndex && (
        <polygon
          fill="#FFFFFF"
          points={`${props.width -
            Math.sqrt(
              (1.2 * props.height - 30) ** 2 +
                ((1.2 * props.height - 30) / 2) ** 2
            ) +
            5} ${1.2 * props.height / 2} ${props.width} ${1.2 * props.height -
            15} ${props.width} 15`}
        />
      )}
    </g>
  </svg>
);

CustomBackground.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  index: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  activeIndex: PropTypes.number
};

export default CustomBackground;
