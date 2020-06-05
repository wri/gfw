import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';

import './styles.scss';

class ChartTooltip extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidUpdate(prevProps) {
    const { payload, settings } = this.props;
    const values = payload && payload.length > 0 && payload[0].payload;
    const prevValues =
      prevProps.payload &&
      prevProps.payload.length > 0 &&
      prevProps.payload[0].payload;
    if (settings && !isEqual(values, prevValues)) {
      const data =
        settings.length &&
        settings.map(d => ({
          ...d,
          label: d.labelFormat
            ? d.labelFormat(d.label || values[d.labelKey])
            : d.label || values[d.labelKey],
          value: d.unitFormat ? d.unitFormat(values[d.key]) : values[d.key],
          valueNum: values[d.key]
        }));

      const sorting = settings.find(s => !!s.sortBy);
      if (sorting && sorting.sortBy === 'value') {
        const sortedData = sortBy(data, 'valueNum').reverse();

        // Optional: empty 2020 value at the bottom.
        const currentYearValue = values[new Date().getFullYear()];
        if (!currentYearValue) {
          const currentYearData = sortedData.findIndex(s => s.key === 'count');
          sortedData.push(...sortedData.splice(currentYearData, 1));
        }

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ data: sortedData });
      } else {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ data });
      }
    }
  }

  render() {
    const { payload, hideZeros, simple } = this.props;
    const values = payload && payload.length > 0 && payload[0].payload;

    return (
      <div>
        {this.state.data && (
          <div className={cx('c-chart-tooltip', { simple })}>
            {this.state.data.map(d => {
              const { label, value } = d;

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
