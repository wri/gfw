import React, { PureComponent } from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { formatNumber } from 'utils/format';

import Paginate from 'components/paginate';

import './numbered-list-styles.scss';

class NumberedList extends PureComponent {
  render() {
    const {
      className,
      data,
      settings,
      settingsConfig,
      handlePageChange,
      linksDisabled,
      linksExt
    } = this.props;
    const { page, pageSize, unit } = settings;
    const pageData = pageSize
      ? data.slice(page * pageSize, (page + 1) * pageSize)
      : data;

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

    return (
      <div className={`c-numbered-list ${className}`}>
        <ul className="list">
          {data.length > 0 &&
            pageData.map((item, index) => {
              const showBar = item.unit === '%' || unit === '%';
              const linkContent = (
                <div className={cx('list-item', { '-bar': showBar })}>
                  <div className="item-label">
                    <div
                      className="item-bubble"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.rank || index + 1 + pageSize * page}
                    </div>
                    <div className="item-name">{item.label}</div>
                  </div>
                  {showBar ? (
                    <div className="item-bar-container">
                      <div className="item-bar">
                        <div
                          className="item-bar -data"
                          style={{
                            width: `${item.value > 100 ? 100 : item.value}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                      <div className="item-value">
                        {formatNumber({
                          num: item.value,
                          unit: item.unit || formatUnit
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="item-value">
                      {formatNumber({
                        num: item.value,
                        unit: item.unit || formatUnit
                      })}
                    </div>
                  )}
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
        {handlePageChange &&
          data.length > settings.pageSize && (
          <Paginate
            settings={settings}
            count={data.length}
            onClickChange={handlePageChange}
          />
        )}
      </div>
    );
  }
}

NumberedList.propTypes = {
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.array,
  handlePageChange: PropTypes.func,
  className: PropTypes.string,
  linksDisabled: PropTypes.bool,
  linksExt: PropTypes.bool
};

export default NumberedList;
