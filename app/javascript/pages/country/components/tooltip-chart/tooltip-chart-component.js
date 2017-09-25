import React from 'react';
import PropTypes from 'prop-types';

const TooltipChart = (props) => {
  const { active } = props;
  if(active) {
    const { payload, label } = props;
    return (
      <div className="c-tooltip-chart">
        <p className="label">{`${payload[0].value} Ha`}</p>
      </div>
    );
  } else {
    return null
  }
};

TooltipChart.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.array,
};

export default TooltipChart;
