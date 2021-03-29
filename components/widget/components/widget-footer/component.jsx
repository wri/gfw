import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactHtmlParser from 'react-html-parser';

import './styles.scss';

class WidgetFooter extends PureComponent {
  static propTypes = {
    simple: PropTypes.bool,
    caution: PropTypes.string,
    statements: PropTypes.array,
    showAttributionLink: PropTypes.bool,
  };

  render() {
    const { statements, caution, simple, showAttributionLink } = this.props;
    const statementsMapped = statements && statements.join(' | ');

    return (
      <div className={cx('c-widget-footer', { simple })}>
        {caution && <div className="--caution">{caution}</div>}
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
