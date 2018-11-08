import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class WidgetFooter extends PureComponent {
  render() {
    const { statement, simple } = this.props;
    return statement ? (
      <div className={cx('c-widget-footer', { simple })}>{statement}</div>
    ) : null;
  }
}

WidgetFooter.propTypes = {
  statement: PropTypes.string,
  simple: PropTypes.bool
};

export default WidgetFooter;
