import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';

import './react-toggle.scss';
import './switch-styles.scss';
import './themes/switch-light.scss';

class Switch extends PureComponent {
  render() {
    const { theme, label, value, options, onChange } = this.props;

    return (
      <div className={`c-switch ${theme || ''}`}>
        {label && <div className="label">{label}</div>}
        <Toggle
          icons={{
            checked: options[0].label,
            unchecked: options[1].label
          }}
          defaultChecked={options[1].value === value}
          onChange={e => {
            const result = e.target.checked
              ? options[1].value
              : options[0].value;
            onChange(result);
          }}
        />
      </div>
    );
  }
}

Switch.propTypes = {
  theme: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array,
  onChange: PropTypes.func
};

export default Switch;
