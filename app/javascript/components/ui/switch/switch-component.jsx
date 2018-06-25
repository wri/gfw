import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';

import './react-toggle.scss';
import './switch-styles.scss';
import './themes/switch-light.scss';
import './themes/switch-toggle.scss';

class Switch extends PureComponent {
  render() {
    const { theme, label, value, options, onChange } = this.props;
    const icons = options
      ? {
        checked: options[0].label,
        unchecked: options[1].label
      }
      : false;
    const defaultChecked = options ? options[1].value === value : false;

    return (
      <div className={`c-switch ${theme || ''}`}>
        {label && <div className="label">{label}</div>}
        <Toggle
          icons={icons}
          defaultChecked={defaultChecked}
          onChange={e => {
            let result = e.target.checked;
            if (options) {
              result = result ? options[1].value : options[0].value;
            }

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
