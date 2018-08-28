import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { NavLink } from 'redux-first-router-link';

import './styles.scss';

class DropdownMenu extends PureComponent {
  render() {
    const { className, options, handleSelect, selected } = this.props;

    return (
      <ul className={`c-dropdown-menu ${className || ''}`}>
        {options.map(l => (
          <li
            key={l.value || l.label}
            className={cx({ active: selected && selected.value === l.value })}
          >
            {handleSelect || l.onSelect ? (
              <button
                onClick={e =>
                  (l.onSelect ? l.onSelect(e) : handleSelect(l.value))
                }
              >
                {l.label}
              </button>
            ) : (
              <NavLink to={l.path} activeClassName="-active">
                {l.label}
              </NavLink>
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
  handleSelect: PropTypes.func,
  selected: PropTypes.object
};

export default DropdownMenu;
