import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class ChartTooltip extends PureComponent {
  render() {
    const { payload, settings, parseData, hideZeros, simple } = this.props;
    const values = payload && payload.length > 0 && payload[0].payload;

    const data = parseData ? parseData({ settings, values }) : settings;
    const filteredData = data?.filter((item) => item !== undefined) || [];

    return (
      <div>
        {data && data.length && (
          <div className={cx('c-chart-tooltip', { simple })}>
            {filteredData.map((item) => {
              const label = item.labelFormat
                ? item.labelFormat(item.label || values[item.labelKey])
                : item.label || values[item.labelKey];

              const value = item.unitFormat
                ? item.unitFormat(values[item.key])
                : values[item.key];

              return hideZeros && (!values || !value) ? null : (
                <div
                  key={item.key || item.labelKey || item.label}
                  className={`data-line ${item.position || ''}`}
                >
                  {label && (
                    <div className="data-label">
                      {item.color &&
                        (item.dashline ? (
                          <div
                            className="data-color data-dash"
                            style={{ borderColor: item.color }}
                          />
                        ) : (
                          <div
                            className="data-color"
                            style={{ backgroundColor: item.color }}
                          />
                        ))}
                      {item.key === 'break' ? (
                        <span className="break-label">{item.label}</span>
                      ) : (
                        <span>{label}</span>
                      )}
                    </div>
                  )}
                  <div className="notranslate">
                    {value !== null && item.unit && item.unitFormat
                      ? `${value}${item.unit}`
                      : item.nullValue || value}
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
  parseData: PropTypes.func,
  hideZeros: PropTypes.bool,
  simple: PropTypes.bool,
};

export default ChartTooltip;
