import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactHtmlParser from 'react-html-parser';

import WidgetAlert from 'components/widget/components/widget-alert';

class WidgetFooter extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    simple: PropTypes.bool,
    alerts: PropTypes.array,
    statements: PropTypes.array,
    location: PropTypes.string,
    showAttributionLink: PropTypes.bool,
    alertSystem: PropTypes.string,
    decorationMessage: PropTypes.string,
  };

  renderAlert = (alerts, alertSystem, type, location) => {
    if (!alerts) return null;

    const locationType = location?.locationType;
    return alerts.map((alert, index) => {
      const whitelist = alert?.whitelist;
      const blacklist = alert?.blacklist;
      const adm0 = location?.adm0;
      const hasWhitelist = Array.isArray(whitelist);
      const hasBlacklist = Array.isArray(blacklist);

      const systemMatches =
        alert?.system === 'all' || alert?.system === alertSystem;

      let shouldDisplayAlert = hasWhitelist
        ? whitelist.includes(adm0)
        : systemMatches;

      if (hasBlacklist && blacklist.includes(adm0)) {
        shouldDisplayAlert = false;
      }

      if (shouldDisplayAlert) {
        return (
          <WidgetAlert
            key={`alert-${index}`}
            type={type}
            alert={alert}
            locationType={locationType}
          />
        );
      }

      return null;
    });
  };

  render() {
    const {
      statements,
      alerts,
      type,
      simple,
      location,
      showAttributionLink,
      alertSystem,
      decorationMessage,
    } = this.props;

    const statementsMapped = statements && statements.join(' | ');
    // TODO: add statement link
    return (
      <div className={cx('c-widget-footer', { simple })}>
        {decorationMessage && (
          <div
            className="c-widget-alert"
            style={{ borderColor: '#97be32', color: '#555' }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: decorationMessage }}
          />
        )}
        {this.renderAlert(alerts, alertSystem, type, location)}
        {statementsMapped && !!statementsMapped.length && (
          <div className="notranslate">{ReactHtmlParser(statementsMapped)}</div>
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
    );
  }
}

export default WidgetFooter;
