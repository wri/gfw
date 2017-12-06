import React from 'react';
import PropTypes from 'prop-types';

const SliderDots = props => {
  const { count, selected, color, callback } = props;
  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push(
      <button
        className={`c-slider-dots__item ${i === selected ? '-selected' : ''}`}
        data-index={i}
        key={i}
        onClick={callback}
        tabIndex={i}
      />
    ); // eslint-disable-line
  }

  return <div className={`c-slider-dots -${color}`}>{dots}</div>;
};

SliderDots.propTypes = {
  count: PropTypes.number.isRequired,
  selected: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired
};

export default SliderDots;
