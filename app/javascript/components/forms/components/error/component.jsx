import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class Submit extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    valid: PropTypes.bool,
    submitFailed: PropTypes.bool,
    submitError: PropTypes.string,
    success: PropTypes.string
  };

  render() {
    const { valid, submitFailed, submitError, success, className } = this.props;

    return (
      <div className={cx('c-form-error', className)}>
        {!submitError &&
          !valid &&
          submitFailed && <span>Required fields are empty!</span>}
        {submitError && <span>{submitError}</span>}
        {!submitError && success && <span className="success">{success}</span>}
      </div>
    );
  }
}

export default Submit;
