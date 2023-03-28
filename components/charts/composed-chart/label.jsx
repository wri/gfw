import React from 'react';
import PropTypes from 'prop-types';
import {
  useDynamicScreenSize,
  SCREEN_SIZES,
} from '../../../utils/useDynamicScreenSize';

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
  const screenSize = useDynamicScreenSize();
  let leftY = '';

  switch (screenSize) {
    case SCREEN_SIZES.sm:
      leftY = '-37%';
      break;
    case SCREEN_SIZES.md:
      leftY = '-10%';
      break;
    case SCREEN_SIZES.lg:
      leftY = '-10%';
      break;
    case SCREEN_SIZES.xl:
      leftY = '-10%';
      break;
    default:
      leftY = '-10%';
      break;
  }

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
            left: leftY,
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
