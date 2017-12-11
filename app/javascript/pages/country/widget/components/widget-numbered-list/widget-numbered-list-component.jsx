import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { getColorPalette } from 'utils/data';

import WidgetPaginate from 'pages/country/widget/components/widget-paginate';

import './widget-numbered-list-styles.scss';

class WidgetNumberedList extends PureComponent {
  render() {
    const {
      className,
      data,
      settings,
      handlePageChange,
      colorRange
    } = this.props;
    const { page, pageSize, unit } = settings;
    const pageData = data.slice(page * pageSize, (page + 1) * pageSize);
    const COLORS = getColorPalette(colorRange, pageSize);

    return (
      <div className={`c-widget-numbered-list ${className}`}>
        <ul className="list">
          {data.length > 0 &&
            pageData.map((item, index) => (
              <li className="list-item" key={item.value}>
                <div className="item-label">
                  <div
                    className="item-bubble"
                    style={{ backgroundColor: COLORS[index] }}
                  >
                    {index + 1 + pageSize * page}
                  </div>
                  <div className="item-name">{item.label}</div>
                </div>
                <div className="item-value">
                  {format('.3s')(item.value)}
                  {unit}
                </div>
              </li>
            ))}
        </ul>
        <WidgetPaginate
          settings={settings}
          count={data.length}
          onClickChange={handlePageChange}
        />
      </div>
    );
  }
}

WidgetNumberedList.propTypes = {
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  colorRange: PropTypes.array.isRequired,
  className: PropTypes.string
};

export default WidgetNumberedList;
