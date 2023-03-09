import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// import './styles.scss';

class Checkbox extends PureComponent {
  render() {
    const { className, value, id = 'checkbox' } = this.props;
    return (
      <div id={id} className={cx('c-checkbox', className)}>
        <span className={cx('green-square', { checked: value })} />
      </div>
    );
  }
}

Checkbox.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.bool,
};

export default Checkbox;
