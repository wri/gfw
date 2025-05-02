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
    locationType: PropTypes.string,
    showAttributionLink: PropTypes.bool,
    alertSystem: PropTypes.string,
    decorationMessage: PropTypes.string,
    admLevel: PropTypes.string,
    adm0: PropTypes.string,
  };

  renderAlert = (alerts, alertSystem, type, locationType, admLevel, adm0) => {
    if (!alerts) return null;

    return alerts.map((alert, index) => {
      const validation = alert.hasConstraints
        ? (alert.system === alertSystem || alertSystem === 'all') &&
          alert.constraints?.admins?.includes(admLevel) &&
          alert.constraints?.countries?.includes(adm0)
        : alert.system === alertSystem || alertSystem === 'all';

      if (validation) {
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
      locationType,
      showAttributionLink,
      alertSystem,
      decorationMessage,
      admLevel,
      adm0,
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
        {this.renderAlert(
          alerts,
          alertSystem,
          type,
          locationType,
          admLevel,
          adm0
        )}
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
