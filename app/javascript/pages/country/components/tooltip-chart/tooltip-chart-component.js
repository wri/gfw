import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

const TooltipChart = (props) => {
  const { active } = props;
  if(active) {
    const { payload, label } = props;
    return (
      <div className="c-tooltip-chart">
        <p className="label">{`${numeral(Math.round(payload[0].value / 1000)).format('0,0')} Ha`}</p>
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
