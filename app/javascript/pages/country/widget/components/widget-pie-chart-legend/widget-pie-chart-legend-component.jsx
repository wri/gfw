import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import './widget-pie-chart-legend-styles.scss';

class WidgetPieChartLegend extends PureComponent {
  render() {
    const { data, config, className } = this.props;

    return (
      <ul className={`c-pie-chart-legend ${className}`}>
        {data.map(
          (item, index) =>
            (item.value ? (
              <li key={index.toString()}>
                <div className="legend-title">
                  <span style={{ backgroundColor: item.color }}>{}</span>
                  {item.name}
                </div>
                <div className="legend-value" style={{ color: item.color }}>
                  {format(config.format)(item[config.key])}
                  {config.unit}
                </div>
              </li>
            ) : null)
        )}
      </ul>
    );
  }
}

WidgetPieChartLegend.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  className: PropTypes.string
};

WidgetPieChartLegend.defaultProps = {
  config: {
    unit: 'ha',
    key: 'value',
    format: '.3s'
  }
};

export default WidgetPieChartLegend;
