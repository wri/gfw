import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

class WidgetChartLegend extends PureComponent {
  render() {
    const { className, vertical = false, data = {} } = this.props;
    const { columns = [] } = data;

    const anyColumnsHaveTitle = !!columns.find((column) => column.title);

    return (
      <div className={cx('c-widget-chart-legend', className, { vertical })}>
        {columns.map(({ title, items }, columnIdx) => {
          return (
            <div key={columnIdx} className="c-widget-chart-legend__column">
              {title && (
                <span className="c-widget-chart-legend__column-title">
                  {title}
                </span>
              )}
              <ul
                className={cx('c-widget-chart-legend__column-items', {
                  padded: anyColumnsHaveTitle && !title,
                })}
              >
                {items.map(({ label, color, dashline }, titleIdx) => {
                  return (
                    <li
                      key={titleIdx}
                      className="c-widget-chart-legend__column-item"
                    >
                      {dashline ? (
                        <span
                          className="c-widget-chart-legend__column-item--dashline"
                          style={{
                            borderColor: color,
                          }}
                        />
                      ) : (
                        <span
                          className="c-widget-chart-legend__column-item--circle"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      )}
                      <p>{label}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }
}

WidgetChartLegend.propTypes = {
  className: PropTypes.string,
  vertical: PropTypes.bool,
  data: {
    columns: {
      title: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    },
  },
};

export default WidgetChartLegend;
