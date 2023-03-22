import React from 'react';

export const LabelX = () => {
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
          <span style={{ fontSize: '1rem' }}>Tree cover (%)</span>
        </div>
      </foreignObject>
    </>
  );
};

export const LabelY = () => {
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
            left: '-7%',
            transform: 'rotate(-90deg)',
          }}
        >
          <span>Land cover (in hectares)</span>
        </div>
      </foreignObject>
    </>
  );
};
