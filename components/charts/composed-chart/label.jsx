import React from 'react';
import PropTypes from 'prop-types';

export const XAxisLabel = ({ label }) => {
  return (
    <>
      <foreignObject
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <span style={{ fontSize: '1rem' }}>{label}</span>
        </div>
      </foreignObject>
    </>
  );
};

XAxisLabel.propTypes = {
  label: PropTypes.string,
};

export const YAxisLabel = ({ label }) => {
  return (
    <>
      <foreignObject
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '-6%',
            transform: 'rotate(-90deg)',
          }}
        >
          <span style={{ fontSize: '1rem' }}>{label}</span>
        </div>
      </foreignObject>
    </>
  );
};

YAxisLabel.propTypes = {
  label: PropTypes.string,
};
