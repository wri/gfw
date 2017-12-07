import React from 'react';
import PropTypes from 'prop-types';

import './button-arrow-styles.scss';

const ButtonArrow = props => {
  const { orientation, disabled } = props;
  return (
    <div
      className={`c-arrow-button -${orientation} ${disabled && '-disabled'}`}
    >
      <svg className="icon">
        <use xlinkHref="#icon-arrow" />
      </svg>
    </div>
  );
};

ButtonArrow.propTypes = {
  orientation: PropTypes.string,
  disabled: PropTypes.bool
};

export default ButtonArrow;
