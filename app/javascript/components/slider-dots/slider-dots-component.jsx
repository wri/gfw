import React from 'react';
import PropTypes from 'prop-types';

const SliderDots = props => {
  const { count, selected, color, callback } = props;
  const containerClass = `c-slider-dots -${color}`;

  const dots = [];
  for (let i = 0; i < count; i++) {
    const dotClass = `c-slider-dots__item ${i === selected ? '-selected' : ''}`;
    dots.push(
      <li
        className={dotClass}
        data-index={i}
        key={i}
        onClick={callback}
        role="button"
        tabIndex={i}
      />
    ); // eslint-disable-line
  }

  return <ul className={containerClass}>{dots}</ul>;
};

SliderDots.propTypes = {
  count: PropTypes.number.isRequired,
  selected: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired
};

export default SliderDots;
