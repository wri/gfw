/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './styles.scss';

class FieldWrapper extends PureComponent {
  static propTypes = {
    touched: PropTypes.bool,
    error: PropTypes.string,
    hidden: PropTypes.bool,
    active: PropTypes.bool,
    label: PropTypes.string,
    children: PropTypes.node,
    required: PropTypes.bool
  };

  render() {
    const {
      touched,
      error,
      hidden,
      active,
      label,
      children,
      required
    } = this.props;

    return (
      <div
        className={cx(
          'c-form-field',
          { error: touched && error },
          { active },
          { hidden }
        )}
      >
        <div className="label">
          <label htmlFor={name}>{`${label || ''}${
            required ? ' *' : ''
          }`}</label>
          {touched && error && <span>{error}</span>}
        </div>
        <div className="input-field">{children}</div>
      </div>
    );
  }
}

export default FieldWrapper;
