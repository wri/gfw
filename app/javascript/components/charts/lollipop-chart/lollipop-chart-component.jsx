import React, { PureComponent } from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { formatNumber } from 'utils/format';

import './lollipop-chart-styles.scss';

class LollipopChart extends PureComponent {
  render() {
    const {
      className,
      data,
      settings,
      settingsConfig,
      linksDisabled,
      linksExt
    } = this.props;
    const { unit } = settings;

    const unitsConfig = settingsConfig.find(conf => conf.key === 'unit');
    const selectedUnitConfig =
      unitsConfig &&
      unitsConfig.options &&
      unitsConfig.options.find(opt => opt.value === unit);
    let formatUnit = unit;
    if (selectedUnitConfig) {
      formatUnit =
        selectedUnitConfig.unit !== undefined
          ? selectedUnitConfig.unit
          : selectedUnitConfig.value;
    }

    const dataMax =
      data &&
      data.reduce((acc, item) => Math.max(acc, Math.abs(item.value)), 0);
    const scale = num => (dataMax ? Math.abs(num) * 100 / dataMax : 0);

    return (
      <div className={cx('c-lollipop-chart', className)}>
        <div className="unit-legend">{`${unit
          .charAt(0)
          .toUpperCase()}${unit.slice(1)} (${formatUnit})`}</div>
        <ul className="list">
          {data.length > 0 &&
            data.map((item, index) => {
              const linkContent = (
                <div className="list-item">
                  <div className="item-label">
                    <div className="item-bubble">{item.rank || index + 1}</div>
                    <div className="item-name">{item.label}</div>
                  </div>
                  <div className="item-lollipop-bar">
                    <div
                      className="item-bar"
                      style={{
                        width: `calc(${scale(item.value)}% - 66px)`,
                        // 100% max - 16 (bubble) - 35px (value text) - 15px margin right
                        backgroundColor: item.color
                      }}
                    />
                    <div
                      className="item-bubble"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="item-value">
                      {formatNumber({
                        num: item.value,
                        unit: item.unit || formatUnit
                      })}
                    </div>
                  </div>
                </div>
              );
              return (
                <li key={`${item.label}-${item.id}`}>
                  {item.path &&
                    linksExt && (
                    <a
                      href={`https://${window.location.host}${item.path}`}
                      target="_blank"
                      rel="noopener nofollower"
                    >
                      {linkContent}
                    </a>
                  )}
                  {item.path &&
                    !linksExt && (
                    <Link
                      className={`${linksDisabled ? 'disabled' : ''}`}
                      to={item.path}
                    >
                      {linkContent}
                    </Link>
                  )}
                  {!item.path && (
                    <div className={`${linksDisabled ? 'disabled' : ''}`}>
                      {linkContent}
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

LollipopChart.propTypes = {
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.array,
  className: PropTypes.string,
  linksDisabled: PropTypes.bool,
  linksExt: PropTypes.bool
};

export default LollipopChart;
