import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactHtmlParser from 'react-html-parser';
import concat from 'lodash/concat';

import WidgetCaution from 'components/widget/components/widget-caution';

import './styles.scss';

class WidgetFooter extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    simple: PropTypes.bool,
    alerts: PropTypes.array,
    caution: PropTypes.object,
    statements: PropTypes.array,
    locationType: PropTypes.string,
    showAttributionLink: PropTypes.bool,
    alertSystem: PropTypes.string,
    decorationMessage: PropTypes.string,
  };

  renderCaution = (caution, alertSystem, type, locationType) => {
    if (!caution) return null;

    if (caution && Array.isArray(caution)) {
      return caution.map((c) => {
        if (c.system === alertSystem || alertSystem === 'all') {
          return (
            <WidgetCaution
              type={type}
              caution={c}
              locationType={locationType}
            />
          );
        }
        return null;
      });
    }

    return (
      <WidgetCaution
        type={type}
        caution={caution}
        locationType={locationType}
      />
    );
  };

  render() {
    const {
      statements,
      alerts,
      caution,
      type,
      simple,
      locationType,
      showAttributionLink,
      alertSystem,
      decorationMessage,
    } = this.props;

    // TODO: remove old 'caution'. here for retro-compatibility. 'alerts' is the new system
    // Adding 'isCaution' property to parse differently later
    if (caution) caution.isCaution = true;
    const cautionAndAlerts = concat(caution, alerts).filter((n) => n);

    const statementsMapped = statements && statements.join(' | ');
    // TODO: add statement link
    return (
      <div className={cx('c-widget-footer', { simple })}>
        {/* TODO: Swap this message for new caution */}
        {decorationMessage && (
          <p
            className="c-widget-caution"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: decorationMessage }}
          />
        )}
        {this.renderCaution(cautionAndAlerts, alertSystem, type, locationType)}
        {statementsMapped && !!statementsMapped.length && (
          <div className="notranslate">{ReactHtmlParser(statementsMapped)}</div>
        )}
        {showAttributionLink && (
          <span>
            Source:
            {' '}
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
