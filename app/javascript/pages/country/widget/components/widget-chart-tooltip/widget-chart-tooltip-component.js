import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import './widget-chart-tooltip-styles.scss';

class WidgetChartTooltip extends PureComponent {
  render() {
    const { payload, settings } = this.props;
    const values = payload.length > 0 && payload[0].payload;

    return (
      <div className="c-widget-chart-tooltip">
        {settings.map(d => (
          <div key={d.key} className="data-line">
            {format(d.unit === '%' ? '.1f' : '.3s')(values[d.key])}
            {d.unit}
          </div>
        ))}
      </div>
    );
  }
}

WidgetChartTooltip.propTypes = {
  payload: PropTypes.array,
  settings: PropTypes.array
};

export default WidgetChartTooltip;
