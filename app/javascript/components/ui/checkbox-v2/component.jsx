import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

const Checkbox = ({ className, checked, onChange, label }) => (
  <div className={cx('c-checkbox-v2', className)}>
    {/* eslint-disable-next-line jsx-a11y/label-has-for */}
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label && <p>{label}</p>}
    </label>
  </div>
);

export default Checkbox;

Checkbox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string
};

Checkbox.defaultProps = {
  checked: false,
  onChange: null
};
