import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { formatCurrency } from 'utils/format';

import './widget-chart-tooltip-styles.scss';

class WidgetChartTooltip extends PureComponent {
  getFormatUnit = (value, unit) => {
    let formatUnit = '';
    switch (unit) {
      case '%':
      case 'net_perc':
        formatUnit = `${format('.1f')(value)}%`;
        break;
      case 'net_usd':
        formatUnit = `${formatCurrency(value, false)} USD`;
        break;
      default:
        formatUnit = format('.3s')(value) + unit;
        break;
    }
    return formatUnit;
  };

  render() {
    const { payload, settings, hideZeros } = this.props;
    const values = payload && payload.length > 0 && payload[0].payload;

    return (
      <div>
        {settings &&
          settings.length && (
            <div className="c-widget-chart-tooltip">
              {settings.map(
                d =>
                  (hideZeros && !values[d.key] ? null : (
                    <div key={d.key} className="data-line">
                      {d.label && (
                        <div className="data-label">
                          {d.color && (
                            <div
                              className="data-color"
                              style={{ backgroundColor: d.color }}
                            />
                          )}
                          {<span>{values[d.label] || d.label}</span>}
                        </div>
                      )}
                      {d.unit
                        ? this.getFormatUnit(values[d.key], d.unit)
                        : values[d.key]}
                    </div>
                  ))
              )}
            </div>
          )}
      </div>
    );
  }
}

WidgetChartTooltip.propTypes = {
  payload: PropTypes.array,
  settings: PropTypes.array,
  hideZeros: PropTypes.bool
};

export default WidgetChartTooltip;
