import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class ChartTooltip extends PureComponent {
  render() {
    const { payload, settings, hideZeros, simple } = this.props;
    const values = payload && payload.length > 0 && payload[0].payload;
    return (
      <div>
        {settings &&
          settings.length && (
          <div className={cx('c-chart-tooltip', { simple })}>
            {settings.map(d => {
              const label = d.labelFormat
                ? d.labelFormat(d.label || values[d.labelKey])
                : d.label || values[d.labelKey];

              const value = d.unitFormat
                ? d.unitFormat(values[d.key])
                : values[d.key];

              return hideZeros && (!values || !value) ? null : (
                <div
                  key={d.key || d.labelKey}
                  className={`data-line ${d.position || ''}`}
                >
                  {label && (
                    <div className="data-label">
                      {d.color &&
                          (d.dashline ? (
                            <div
                              className="data-color data-dash"
                              style={{ borderColor: d.color }}
                            />
                          ) : (
                            <div
                              className="data-color"
                              style={{ backgroundColor: d.color }}
                            />
                          ))}
                      {d.key === 'break' ? (
                        <span className="break-label">{d.label}</span>
                      ) : (
                        <span>{label}</span>
                      )}
                    </div>
                  )}
                  <div className="notranslate">
                    {value !== null && d.unit && d.unitFormat
                      ? `${value}${d.unit}`
                      : d.nullValue || value}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

ChartTooltip.propTypes = {
  payload: PropTypes.array,
  settings: PropTypes.array,
  hideZeros: PropTypes.bool,
  simple: PropTypes.bool
};

export default ChartTooltip;
