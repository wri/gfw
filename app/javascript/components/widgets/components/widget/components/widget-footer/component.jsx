import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactHtmlParser from 'react-html-parser';

import './styles.scss';

class WidgetFooter extends PureComponent {
  render() {
    const { statements, simple, showAttributionLink } = this.props;
    const statementsMapped = statements && statements.join(' | ');

    return statementsMapped && !!statementsMapped.length ? (
      <div className={cx('c-widget-footer', { simple })}>
        <div className="notranslate">{ReactHtmlParser(statementsMapped)}</div>
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
  statements: PropTypes.array,
  showAttributionLink: PropTypes.bool
};

export default WidgetFooter;
