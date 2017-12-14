import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import './widget-pie-chart-legend-styles.scss';

class WidgetPieChartLegend extends PureComponent {
  render() {
    const { data, settings, className } = this.props;
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
                  {settings.unit === '%'
                    ? format('.1f')(item.percentage)
                    : format('.3s')(item.value)}
                  <span className="unit-text">{settings.unit}</span>
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
  settings: PropTypes.object,
  className: PropTypes.string
};

export default WidgetPieChartLegend;
