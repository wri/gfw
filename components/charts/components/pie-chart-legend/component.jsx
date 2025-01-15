import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import cx from 'classnames';

class PieChartLegend extends PureComponent {
  render() {
    const { data, chartSettings = {}, config, className, simple } = this.props;
    const { size, legend } = chartSettings;

    const sizeClass = (() => {
      if (size) return size;
      if (data.length > 5) return 'x-small';
      if (data.length > 3) return 'small';
      return '';
    })();

    const shouldDisplaySmallerValues = data?.some(
      (item) =>
        `${formatNumber({
          num: item[config.key],
          unit: item.unit ? item.unit : config.unit,
          spaceUnit: item.unit !== '%' && config.unit !== 'countsK',
        })}`?.length > 9
    );

    return (
      <div
        className={cx('c-pie-chart-legend', className)}
        style={legend?.style}
      >
        <ul className={cx({ simple, sizeClass })}>
          {data.map((item, index) => {
            const PLACEHOLDER = new RegExp(`\\bPLACEHOLDER\\b`, 'g');
            const label = item.label.replace(PLACEHOLDER, `and`);
            const value = `${formatNumber({
              num: item[config.key],
              unit: item.unit ? item.unit : config.unit,
              spaceUnit: item.unit !== '%' && config.unit !== 'countsK',
            })}`;

            return (
              <li className="legend-item" key={index.toString()}>
                <div className="legend-title">
                  <span style={{ backgroundColor: item.color }}>{}</span>
                  <p>
                    {label}
                    {sizeClass === 'x-small' && `- ${value}`}
                  </p>
                </div>
                {sizeClass !== 'x-small' && (
                  <div
                    className={cx({
                      'legend-value': true,
                      'legend-value--small': shouldDisplaySmallerValues,
                    })}
                    style={{ color: item.color }}
                  >
                    {value}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

PieChartLegend.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  chartSettings: PropTypes.shape({
    size: PropTypes.oneOf(['small', 'x-small']),
    legend: PropTypes.shape({ style: PropTypes.object }),
    chart: PropTypes.shape({ style: PropTypes.object }),
  }),
  simple: PropTypes.bool,
  className: PropTypes.string,
};

PieChartLegend.defaultProps = {
  config: {
    unit: '',
    key: 'value',
    format: '.3s',
  },
};

export default PieChartLegend;
