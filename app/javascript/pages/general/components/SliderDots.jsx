import React from 'react';
import PropTypes from 'prop-types';

const SliderDots = (props) => {
  const {count, selected, color} = props;
  const containerClass = `c-slider-dots -${color}`;

  let dots = [];
  for (var i = 0; i < count; i++) {
    const dotClass = `c-slider-dots__item ${ i === selected ? '-selected' : '' }`;
    dots.push(<li className={dotClass} data-index={i} key={i}></li>);
  }

  return (
    <ul className={containerClass}>
      {dots}
    </ul>
  );
};

SliderDots.propTypes = {
  count: PropTypes.number.isRequired,
  selected:PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};

export default SliderDots;
