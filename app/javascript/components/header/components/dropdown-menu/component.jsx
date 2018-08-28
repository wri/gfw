import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class DropdownMenu extends PureComponent {
  render() {
    const { className, options, handleSelect } = this.props;

    return (
      <ul className={`c-dropdown-menu ${className || ''}`}>
        {options.map(l => (
          <li key={l.value || l.label}>
            {handleSelect || l.onSelect ? (
              <button
                onClick={e =>
                  (l.onSelect ? l.onSelect(e) : handleSelect(l.value))
                }
              >
                {l.label}
              </button>
            ) : (
              <a href={l.path}>{l.label}</a>
            )}
          </li>
        ))}
      </ul>
    );
  }
}

DropdownMenu.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  handleSelect: PropTypes.func
};

export default DropdownMenu;
