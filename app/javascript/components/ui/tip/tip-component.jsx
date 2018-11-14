import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './tip-styles.scss';

class Tip extends PureComponent {
  render() {
    const { text, className } = this.props;
    return <div className={cx('c-tip', className)}>{text}</div>;
  }
}

Tip.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string
};

export default Tip;
