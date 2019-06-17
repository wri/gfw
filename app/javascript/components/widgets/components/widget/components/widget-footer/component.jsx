import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class WidgetFooter extends PureComponent {
  render() {
    const { statement, simple, showAttributionLink } = this.props;
    return statement ? (
      <div className={cx('c-widget-footer', { simple })}>
        {statement}
        {showAttributionLink && (
          <span>
            Source:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.globalforestwatch.org"
            >
              Global Forest Watch
            </a>
          </span>
        )}
      </div>
    ) : null;
  }
}

WidgetFooter.propTypes = {
  simple: PropTypes.bool,
  statement: PropTypes.string,
  showAttributionLink: PropTypes.bool
};

export default WidgetFooter;
