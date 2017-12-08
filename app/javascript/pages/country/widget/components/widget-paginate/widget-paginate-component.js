import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';

import './widget-paginate-styles.scss';

class WidgetPaginate extends PureComponent {
  render() {
    const { settings, count, onClickChange } = this.props;
    const { page, pageSize } = settings;
    const showPrev = page > 0;
    const showNext = count > pageSize * (page + 1);

    return (
      <div className="c-widget-paginate">
        {showPrev && (
          <Button
            className="button-up square theme-button-small theme-button-light"
            onClick={() => onClickChange(-1)}
          >
            <svg className="icon icon-angle-arrow-down">
              <use xlinkHref="#icon-angle-arrow-down" />
            </svg>
          </Button>
        )}
        {showNext && (
          <Button
            className="button-down square theme-button-small theme-button-light"
            onClick={() => onClickChange(1)}
          >
            <svg className="icon icon-angle-arrow-down">
              <use xlinkHref="#icon-angle-arrow-down" />
            </svg>
          </Button>
        )}
      </div>
    );
  }
}

WidgetPaginate.propTypes = {
  settings: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onClickChange: PropTypes.func.isRequired
};

export default WidgetPaginate;
