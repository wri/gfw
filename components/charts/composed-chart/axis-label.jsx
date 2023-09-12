import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const AxisLabel = ({ label, direction, isSimple = false }) => (
  <>
    <foreignObject
      width="100%"
      height="100%"
      className={`${direction}-label-container`}
    >
      <div className={`${direction}-label`}>
        <span
          className={cx({
            'simple-mode-label': isSimple,
          })}
        >
          {label}
        </span>
      </div>
    </foreignObject>
  </>
);

AxisLabel.propTypes = {
  label: PropTypes.string,
  direction: PropTypes.string,
  isSimple: PropTypes.bool,
};

export default AxisLabel;
