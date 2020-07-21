import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

import { APP_URL } from 'utils/constants';

import Icon from 'components/ui/icon';
import DropdownMenu from 'components/header/components/dropdown-menu';

import arrowIcon from 'assets/icons/arrow-down.svg?sprite';

import './styles.scss';

class NavMenu extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    fullScreen: PropTypes.bool,
    menuItems: PropTypes.array,
    NavLinkComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  state = {
    activeSubmenu: '',
  };

  setActiveSubmenu = (parent) => {
    this.setState({ activeSubmenu: parent });
  };

  render() {
    const { className, menuItems, fullScreen, NavLinkComponent } = this.props;
    const { activeSubmenu } = this.state;

    return menuItems ? (
      <ul
        className={cx('c-nav-menu', className, { 'full-screen': fullScreen })}
      >
        {menuItems.map((item) => (
          <li key={item.href || item.label} className="nav-item">
            {item.href && (
              <Fragment>
                {NavLinkComponent ? (
                  <NavLinkComponent
                    href={item.href}
                    as={item.as}
                    className={cx('nav-link', { 'with-submenu': item.submenu })}
                    activeClassName="active"
                    activeShallow
                  >
                    {item.label}
                  </NavLinkComponent>
                ) : (
                  <a
                    href={`${APP_URL}${item.as || item.href}`}
                    className={cx(
                      'nav-link',
                      { 'with-submenu': item.submenu },
                      {
                        active:
                          typeof window !== 'undefined' &&
                          window.location.pathname.includes(
                            item.as || item.href
                          ),
                      }
                    )}
                  >
                    {item.label}
                  </a>
                )}
              </Fragment>
            )}
            {item.extLink && (
              <a
                href={item.extLink}
                target="_blank"
                className="nav-link"
                rel="noopener noreferrer"
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
                    )}
                  aria-label="topics"
                >
                  <Icon
                    className={cx('icon-arrow', {
                      active: activeSubmenu === item.label,
                    })}
                    icon={arrowIcon}
                  />
                </button>
                {activeSubmenu === item.label && (
                  <DropdownMenu
                    className="submenu"
                    options={item.submenu}
                    hideMenu={() => this.setActiveSubmenu(null)}
                    NavLinkComponent={NavLinkComponent}
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

export default NavMenu;
