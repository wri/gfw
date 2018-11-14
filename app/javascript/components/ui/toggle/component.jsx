import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';
import './themes/large.scss';

class Toggle extends PureComponent {
  render() {
    const { color, onToggle, value, theme } = this.props;

    return (
      <button
        role="switch"
        aria-checked={value && value.toString()}
        className={`c-toggle ${value ? '-active' : ''} ${theme || ''}`}
        style={{ backgroundColor: value && color ? color : null }}
        onClick={() => onToggle(!value)}
      />
    );
  }
}

Toggle.propTypes = {
  color: PropTypes.string,
  onToggle: PropTypes.func,
  value: PropTypes.bool,
  theme: PropTypes.string
};

export default Toggle;
