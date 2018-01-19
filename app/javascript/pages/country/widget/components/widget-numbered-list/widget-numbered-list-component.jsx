import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { getColorPalette } from 'utils/data';
import Link from 'redux-first-router-link';

import WidgetPaginate from 'pages/country/widget/components/widget-paginate';

import './widget-numbered-list-styles.scss';

class WidgetNumberedList extends PureComponent {
  render() {
    const {
      className,
      data,
      settings,
      handlePageChange,
      colorRange,
      linksDisabled
    } = this.props;
    const { page, pageSize, unit } = settings;
    const pageData = pageSize
      ? data.slice(page * pageSize, (page + 1) * pageSize)
      : data;
    const COLORS = getColorPalette(colorRange, pageSize || pageData.length);

    return (
      <div className={`c-widget-numbered-list ${className}`}>
        <ul className="list">
          {data.length > 0 &&
            pageData.map((item, index) => (
              <li key={`${item.label}-${item.id}`}>
                <Link
                  className={`list-item ${linksDisabled ? 'disabled' : ''}`}
                  to={item.path}
                >
                  <div className="item-label">
                    <div
                      className="item-bubble"
                      style={{ backgroundColor: COLORS[index] }}
                    >
                      {item.rank || index + 1 + pageSize * page}
                    </div>
                    <div className="item-name">{item.label}</div>
                  </div>
                  <div className="item-value">
                    {format(item.value < 1 ? '.2f' : '.3s')(item.value)}
                    {unit}
                  </div>
                </Link>
              </li>
            ))}
        </ul>
        {handlePageChange &&
          data.length > settings.pageSize && (
            <WidgetPaginate
              settings={settings}
              count={data.length}
              onClickChange={handlePageChange}
            />
          )}
      </div>
    );
  }
}

WidgetNumberedList.propTypes = {
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func,
  colorRange: PropTypes.array.isRequired,
  className: PropTypes.string,
  linksDisabled: PropTypes.bool
};

export default WidgetNumberedList;
