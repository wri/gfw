import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { track } from 'app/analytics';

import './styles.scss';

class WidgetFooter extends PureComponent {
  render() {
    const {
      statement,
      simple,
      showAttributionLink,
      type,
      location
    } = this.props;
    return statement ? (
      <div className={cx('c-widget-footer', { simple })}>
        {statement}
        {type === 'loss' && (
          <p>
            NOTE: 2018 tree cover loss data is coming soon! In the meantime,
            download 2018 tree cover loss statistics{' '}
            <a
              href={`https://gfw2-data.s3.amazonaws.com/country-pages/country_stats/download/${location.adm0 ||
                'global'}.xlsx`}
              target="_blank"
              onClick={() =>
                track('downloadDashboardPage', {
                  label: `download ${type} ${location.adm0}`
                })
              }
            >
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
  location: PropTypes.object,
  type: PropTypes.string,
  statement: PropTypes.string,
  showAttributionLink: PropTypes.bool
};

export default WidgetFooter;
