import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import './widget-chart-tooltip-styles.scss';

class WidgetChartTooltip extends PureComponent {
  render() {
    const { payload, unit } = this.props;
    const payloadKey = unit === '%' ? 'percentage' : 'value';
    const value = payload.length > 0 && payload[0].payload[payloadKey];
    const valueFormat = unit === '%' ? '.1f' : '.2s';

    return (
      <div className="c-widget-chart-tooltip">
        {format(valueFormat)(value)}
        {unit}
      </div>
    );
  }
}

WidgetChartTooltip.propTypes = {
  payload: PropTypes.array,
  unit: PropTypes.string
};

export default WidgetChartTooltip;
