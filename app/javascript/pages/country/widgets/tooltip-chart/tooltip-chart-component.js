import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import './tooltip-chart-styles.scss';

const TooltipChart = props => {
  const { active } = props;
  if (active) {
    const { payload, showCountry, percentage, percentageAndArea } = props;
    let valueShow;
    if (percentageAndArea) {
      valueShow = `${numeral(Math.round(payload[0].payload.percentage)).format(
        '0,0'
      )}%`;
    } else if (payload) {
      valueShow = !percentage
        ? `${numeral(Math.round(payload[0].value / 1000)).format('0,0')}ha`
        : `${numeral(Math.round(payload[0].value)).format('0,0')}%`;
    } else {
      valueShow = null;
    }
    return (
      <div className="c-tooltip-chart">
        {showCountry && <span className="name">{payload[0].name}</span>}
        <p className="label">{valueShow}</p>
      </div>
    );
  }
  return null;
};

TooltipChart.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  showCountry: PropTypes.bool,
  percentage: PropTypes.bool,
  percentageAndArea: PropTypes.bool
};

export default TooltipChart;
