import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import cx from 'classnames';

// import './styles.scss';

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
        })}`?.length > 9
    );

    return (
      <div
        className={cx('c-pie-chart-legend', className)}
        style={legend?.style}
      >
        <ul className={cx({ simple, sizeClass })}>
          {data.map((item, index) => {
            const value = `${formatNumber({
              num: item[config.key],
              unit: item.unit ? item.unit : config.unit,
            })}`;
            return (
              <li className="legend-item" key={index.toString()}>
                <div className="legend-title">
                  <span style={{ backgroundColor: item.color }}>{}</span>
                  <p>
                    {item.label}
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
    legend: { style: PropTypes.object },
    chart: { style: PropTypes.object },
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
