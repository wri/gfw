import React from 'react';
import PropTypes from 'prop-types';
import { useDynamicScreenSize } from '../../../utils/useDynamicScreenSize';

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
  const isMediumOrWider = useDynamicScreenSize({ size: 'sm' });

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
<<<<<<< HEAD
            left: '-6%',
=======
            left: isMediumOrWider ? '-10%' : '-37%',
>>>>>>> 07baa665c6 (feat(tree-cover-density): calculate Y axis position dynamically)
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
