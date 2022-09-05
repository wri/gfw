import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactHtmlParser from 'react-html-parser';

import WidgetCaution from 'components/widget/components/widget-caution';

import './styles.scss';

class WidgetFooter extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    simple: PropTypes.bool,
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
      caution,
      type,
      simple,
      locationType,
      showAttributionLink,
      alertSystem,
      decorationMessage,
    } = this.props;
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
        {this.renderCaution(caution, alertSystem, type, locationType)}
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
