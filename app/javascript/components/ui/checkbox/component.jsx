import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class Checkbox extends PureComponent {
  render() {
    const { className, value } = this.props;
    return (
      <div className={cx('c-checkbox', className)}>
        <span className={cx('green-square', { checked: value })} />
      </div>
    );
  }
}

Checkbox.propTypes = {
  className: PropTypes.string,
  value: PropTypes.bool
};

export default Checkbox;
