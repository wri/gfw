import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link as AnchorLink } from 'react-scroll';
import { NavLink } from 'redux-first-router-link';

import Icon from 'components/ui/icon';

import './subnav-menu-styles.scss';
import './themes/subnav-dark.scss'; // eslint-disable-line
import './themes/subnav-plain.scss'; // eslint-disable-line
import './themes/subnav-small-light.scss'; // eslint-disable-line

class SubNavMenu extends PureComponent {
  render() {
    const { links, className, theme, checkActive } = this.props;

    return (
      <div className={`c-subnav-menu ${theme || ''} ${className || ''}`}>
        <ul className="buttons">
          {links &&
            links.length &&
            links.map(link => {
              let LinkComponent = '';
              if (link.anchor) {
                LinkComponent = (
                  <AnchorLink
                    className="text -paragraph-5 -color-8"
                    to={link.anchor}
                    spy
                    smooth
                    duration={500}
                  >
                    {link.icon && <Icon icon={link.icon} />}
                    <span>{link.label}</span>
                  </AnchorLink>
                );
              } else if (link.onClick) {
                LinkComponent = (
                  <button
                    className={`text -paragraph-5 -color-8 ${
                      link.active ? 'active' : ''
                    }`}
                    onClick={() => {
                      link.onClick();
                    }}
                  >
                    {/* fix for safari 10 flex issues */}
                    <div className="button-wrapper">
                      {link.icon && <Icon icon={link.icon} />}
                      <span>{link.label}</span>
                    </div>
                  </button>
                );
              } else {
                LinkComponent = (
                  <NavLink
                    className="text -paragraph-5 -color-8"
                    to={link.path}
                    activeClassName="active"
                    exact
                    isActive={checkActive ? () => link.active : null}
                  >
                    {link.icon && <Icon icon={link.icon} />}
                    <span>{link.label}</span>
                  </NavLink>
                );
              }
              return <li key={link.label}>{LinkComponent}</li>;
            })}
        </ul>
      </div>
    );
  }
}

SubNavMenu.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      anchor: PropTypes.string,
      path: PropTypes.string
    })
  ),
  className: PropTypes.string,
  theme: PropTypes.string,
  checkActive: PropTypes.bool
};

export default SubNavMenu;
