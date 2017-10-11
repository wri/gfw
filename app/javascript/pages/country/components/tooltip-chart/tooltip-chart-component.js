import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

const TooltipChart = (props) => {
  const { active } = props;
  if (active) {
    const { payload, label, showCountry, percentage, percentageAndArea } = props;
    let valueShow;
    console.log(props);
    if (percentageAndArea) {
      valueShow = numeral(Math.round(payload[0].payload.percentage)).format('0,0') + '%'
    } else {
      valueShow = !percentage ? numeral(Math.round(payload[0].value / 1000)).format('0,0') + 'Ha' : numeral(Math.round(payload[0].value)).format('0,0') + '%';
    }
    return (
      <div className="c-tooltip-chart">
        {showCountry && <span className="name">{payload[0].name}</span>}
        <p className="label">{valueShow}</p>
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
