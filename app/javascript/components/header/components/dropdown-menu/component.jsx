import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { NavLink } from 'redux-first-router-link';

import './styles.scss';

class DropdownMenu extends PureComponent {
  render() {
    const { className, options, handleSelect, selected } = this.props;

    return (
      <ul className={`c-dropdown-menu ${className || ''}`}>
        {options &&
          options.map(l => (
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
                <Fragment>
                  {l.navLink && <NavLink to={l.path}>{l.label}</NavLink>}
                  {!l.navLink && <a href={l.path}>{l.label}</a>}
                </Fragment>
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
