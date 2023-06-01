import React from 'react';
import PropTypes from 'prop-types';

const AxisLabel = ({ label, direction }) => (
  <>
    <foreignObject
      width="100%"
      height="100%"
      className={`${direction}-label-container`}
    >
      <div className={`${direction}-label`}>
        <span>{label}</span>
      </div>
    </foreignObject>
  </>
);

AxisLabel.propTypes = {
  label: PropTypes.string,
  direction: PropTypes.string,
};

export default AxisLabel;
