import React, { PureComponent } from 'react';
import MediaQuery from 'react-responsive';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { formatNumber } from 'utils/format';
import { SCREEN_M } from 'utils/constants';

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

    let dataMax =
      data && data.reduce((acc, item) => Math.max(acc, item.value), 0);
    let dataMin =
      data && data.reduce((acc, item) => Math.min(acc, item.value), 0);
    dataMax = dataMax && dataMax > 0 ? dataMax : 0;
    dataMin = dataMin && dataMin < 0 ? dataMin : 0;
    const interpolate = num =>
      Math.abs(num) * 100 / (dataMax + Math.abs(dataMin) || 1);

    let ticks = [dataMin, dataMin / 2, 0, dataMax / 2, dataMax];
    if (dataMin === 0) ticks = [0, dataMax * 0.33, dataMax * 0.66, dataMax];
    if (dataMax === 0) ticks = [dataMin, dataMin * 0.66, dataMin * 0.33, 0];

    const allNegative = !data.some(item => item.value > 0);
    const allPositive = !data.some(item => item.value < 0);
    const isScrollable = isDesktop =>
      (isDesktop ? data.length > 9 : data.length > 4);

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className={cx('c-lollipop-chart', className)}>
            <div className="unit-legend">{`${unit
              .charAt(0)
              .toUpperCase()}${unit.slice(1)} (${formatUnit})`}</div>
            <div className="custom-xAxis">
              <div
                style={{
                  marginLeft: '40%'
                }}
              >
                <div
                  className="custom-xAxis-ticks"
                  style={{
                    ...((allNegative || (!allPositive && !allNegative)) && {
                      marginLeft: '67px',
                      marginRight: isScrollable(isDesktop) ? '15px' : 0
                    }),
                    ...((allPositive || (!allPositive && !allNegative)) && {
                      marginRight: isScrollable(isDesktop) ? '82px' : '67px'
                    })
                  }}
                >
                  {ticks.map(tick => (
                    <div
                      style={{
                        position: 'absolute',
                        right:
                          tick < 0 &&
                          (allNegative
                            ? `calc(${interpolate(tick)}% - 12px)`
                            : `calc(${interpolate(tick - dataMax)}% - 12px)`),
                        left:
                          tick === 0
                            ? `calc(${interpolate(dataMin)}% - 3px)`
                            : tick > 0 &&
                              `calc(${interpolate(tick - dataMin)}% - 8px)`
                      }}
                    >
                      {Math.round(tick)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className={cx('list-wrapper', {
                '-scrollable': isScrollable(isDesktop)
              })}
            >
              <ul>
                {data.length > 0 &&
                  data.map((item, index) => {
                    const isNegative = item.value < 0;
                    const linkContent = (
                      <div className="list-item">
                        <div className="item-label">
                          <div className="item-bubble">
                            {item.rank || index + 1}
                          </div>
                          <div className="item-name">{item.label}</div>
                        </div>
                        <div
                          className={cx('item-lollipop-bar', {
                            'space-left':
                              allNegative || (!allPositive && !allNegative),
                            'space-right':
                              allPositive || (!allPositive && !allNegative)
                          })}
                          style={
                            isNegative ? { flexDirection: 'row-reverse' } : {}
                          }
                        >
                          <div
                            className="item-spacer"
                            style={{
                              width: `${interpolate(
                                isNegative ? dataMax : dataMin
                              )}%`
                            }}
                          />
                          <div
                            className="lollipop"
                            style={{
                              width: `calc(${interpolate(item.value)}%)`
                              // 100% max - 35px (value text) - 32px text margin
                            }}
                          >
                            <div
                              className="item-bar"
                              style={{
                                backgroundColor: item.color
                              }}
                            />
                            <div
                              className="item-bubble -lollipop"
                              style={{
                                backgroundColor: item.color,
                                transform: `translateX(${
                                  isNegative ? '-8px' : '8px'
                                })`,
                                [isNegative ? 'left' : 'right']: 0
                              }}
                            />
                            <div
                              className="item-value"
                              style={
                                isNegative
                                  ? {
                                    left: '0',
                                    transform: 'translateX(-67px)'
                                  }
                                  : {
                                    right: '0',
                                    transform: 'translateX(67px)'
                                  }
                              }
                            >
                              {formatNumber({
                                num: item.value,
                                unit: item.unit || formatUnit
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    return (
                      <li key={`${item.label}-${item.id}`}>
                        {item.path &&
                          linksExt && (
                          <a
                            href={`https://${window.location.host}${
                              item.path
                            }`}
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
            <div
              className="cartesian-grid"
              style={{
                ...(allNegative && {
                  right: isScrollable(isDesktop) ? '15px' : 0,
                  width: isScrollable(isDesktop)
                    ? 'calc(60% - 82px)'
                    : 'calc(60% - 67px)'
                }),
                ...(allPositive && {
                  right: isScrollable(isDesktop) ? '82px' : '67px',
                  width: isScrollable(isDesktop) ? 'calc(60% - 15px)' : '60%'
                }),
                ...(!allPositive &&
                  !allNegative && {
                  right: isScrollable(isDesktop) ? '82px' : '67px',
                  width: isScrollable(isDesktop)
                    ? 'calc(60% - 142px)'
                    : 'calc(60% - 134px)'
                })
              }}
            >
              {ticks.map(tick => (
                <div
                  className="grid-line"
                  style={{
                    position: 'absolute',
                    right:
                      tick < 0 &&
                      (allNegative
                        ? `${interpolate(tick)}%`
                        : `${interpolate(tick - dataMax)}%`),
                    left:
                      tick === 0
                        ? `${interpolate(dataMin)}%`
                        : tick > 0 && `${interpolate(tick - dataMin)}%`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </MediaQuery>
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
