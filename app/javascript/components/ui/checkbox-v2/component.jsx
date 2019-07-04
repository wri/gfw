import React from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';

import './styles.scss';

const Checkbox = ({ checked, onChange }) => (
  <div className="c-checkbox-v2">
    {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
    <span role="button" onClick={onChange}>
      <input type="checkbox" checked={checked} />
      <span />
    </span>
  </div>
);

export default Checkbox;

Checkbox.propTypes = {
  // options: PropTypes.array,
  // option: PropTypes.object,
  onChange: PropTypes.func,
  checked: PropTypes.bool
  // theme: PropTypes.string
};

Checkbox.defaultProps = {
  checked: false,
  onChange: null
};
