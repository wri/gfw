import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';
import './themes/large.scss';

class Toggle extends PureComponent {
  render() {
    const { color, layer, onToggle, value, theme } = this.props;

    return (
      <button
        data-id={`toggle-${layer}`}
        id={`toggle-${layer}`}
        role="switch"
        aria-label="toggle"
        aria-checked={value && value.toString()}
        className={`c-toggle ${value ? '-active' : ''} ${theme || ''}`}
        style={{ backgroundColor: value && color ? color : null }}
        onClick={(e) => onToggle(!value, e)}
      />
    );
  }
}

Toggle.propTypes = {
  layer: PropTypes.string,
  color: PropTypes.string,
  onToggle: PropTypes.func,
  value: PropTypes.bool,
  theme: PropTypes.string,
};

export default Toggle;
