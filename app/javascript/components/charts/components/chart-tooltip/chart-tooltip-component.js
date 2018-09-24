import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './chart-tooltip-styles.scss';

class ChartTooltip extends PureComponent {
  render() {
    const { payload, settings, hideZeros } = this.props;
    const values = payload && payload.length > 0 && payload[0].payload;
    return (
      <div>
        {settings &&
          settings.length && (
            <div className="c-chart-tooltip">
              {settings.map(
                d =>
                  (hideZeros && (!values || !values[d.key]) ? null : (
                    <div
                      key={d.key}
                      className={`data-line ${d.position || ''}`}
                    >
                      {(d.label || d.labelKey) && (
                        <div className="data-label">
                          {d.color && (
                            <div
                              className="data-color"
                              style={{ backgroundColor: d.color }}
                            />
                          )}
                          {d.key === 'break' ? (
                            <span className="break-label">{d.label}</span>
                          ) : (
                            <span>{d.label || values[d.labelKey]}</span>
                          )}
                        </div>
                      )}
                      {d.unit && d.unitFormat
                        ? `${d.unitFormat(values[d.key])}${d.unit}`
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

ChartTooltip.propTypes = {
  payload: PropTypes.array,
  settings: PropTypes.array,
  hideZeros: PropTypes.bool
};

export default ChartTooltip;
