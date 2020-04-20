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
                const value = d.unitFormat
                  ? d.unitFormat(values[d.key])
                  : values[d.key];

                return hideZeros && (!values || !value) ? null : (
                  <div key={d.key} className={`data-line ${d.position || ''}`}>
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
                    <div className="notranslate">
                      {d.unit && d.unitFormat ? `${value}${d.unit}` : value}
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
