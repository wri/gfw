import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { NavLink } from 'redux-first-router-link';
import OutsideClickHandler from 'react-outside-click-handler';

import Icon from 'components/ui/icon';
import DropdownMenu from 'components/header/components/dropdown-menu';
import arrowIcon from 'assets/icons/arrow-down.svg';

import './styles.scss';

class NavMenu extends PureComponent {
  state = {
    activeSubmenu: ''
  };

  setActiveSubmenu = parent => {
    this.setState({ activeSubmenu: parent });
  };

  render() {
    const { className, menuItems } = this.props;
    const { activeSubmenu } = this.state;

    return menuItems ? (
      <ul className={cx('c-nav-menu', className)}>
        {menuItems.map(item => (
          <li key={item.path || item.label} className="nav-item">
            {item.path && (
              <NavLink
                to={item.path}
                className={cx('nav-link', { 'with-submenu': item.submenu })}
                activeClassName="-active"
              >
                {item.label}
              </NavLink>
            )}
            {item.extLink && (
              <a
                href={item.extLink}
                className="nav-link"
                target="_blank"
                rel="noopener nofollower"
              >
                {item.label}
              </a>
            )}
            {item.submenu && (
              <OutsideClickHandler
                onOutsideClick={() => this.setActiveSubmenu(null)}
              >
                <button
                  className="nav-link hidden"
                  onClick={() =>
                    this.setActiveSubmenu(
                      item.label === activeSubmenu ? null : item.label
                    )
                  }
                >
                  <Icon
                    className={cx('icon-arrow', {
                      active: activeSubmenu === item.label
                    })}
                    icon={arrowIcon}
                  />
                </button>
                {activeSubmenu === item.label && (
                  <DropdownMenu
                    className="submenu"
                    options={item.submenu}
                    hideMenu={() => this.setActiveSubmenu(null)}
                  />
                )}
              </OutsideClickHandler>
            )}
          </li>
        ))}
      </ul>
    ) : null;
  }
}

NavMenu.propTypes = {
  className: PropTypes.string,
  menuItems: PropTypes.array
};

export default NavMenu;
