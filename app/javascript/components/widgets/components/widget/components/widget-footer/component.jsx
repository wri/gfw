import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class WidgetFooter extends PureComponent {
  render() {
    const { statement, simple, showAttributionLink, type } = this.props;
    return statement ? (
      <div className={cx('c-widget-footer', { simple })}>
        {statement}
        {type === 'loss' && (
          <p>
            NOTE: 2018 tree cover loss data coming to the dashboards soon! In
            the meantime, download 2018 tree cover loss statistics{' '}
            <a href="" target="_blank">
              here
            </a>.
          </p>
        )}
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
  type: PropTypes.string,
  statement: PropTypes.string,
  showAttributionLink: PropTypes.bool
};

export default WidgetFooter;
