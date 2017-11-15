import React from 'react';
import PropTypes from 'prop-types';

const ButtonArrow = props => {
  const { orientation } = props;
  return (
    <div className={`c-arrow-button -${orientation}`}>
      <svg className="icon">
        <use xlinkHref="#icon-arrow" />
      </svg>
    </div>
  );
};

ButtonArrow.propTypes = {
  orientation: PropTypes.string
};

export default ButtonArrow;
