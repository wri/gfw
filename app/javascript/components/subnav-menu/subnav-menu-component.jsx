import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link as AnchorLink } from 'react-scroll';
import { NavLink } from 'redux-first-router-link';

import './subnav-menu-styles.scss';
import 'styles/themes/subnav/subnav-dark.scss'; // eslint-disable-line

class SubNavMenu extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { links, className, theme, handleClick, activeLink } = this.props;
    return (
      <div className={`c-subnav-menu ${theme || ''} ${className || ''}`}>
        <div className="row">
          <div className="small-12 columns">
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
                        {link.label}
                      </AnchorLink>
                    );
                  } else if (link.value) {
                    LinkComponent = (
                      <button
                        key={link.value}
                        className={`text -paragraph-5 -color-8 ${
                          activeLink === link.value ? 'active' : ''
                        }`}
                        onClick={() => handleClick(link.value)}
                      >
                        {link.label}
                      </button>
                    );
                  } else {
                    LinkComponent = (
                      <NavLink
                        exact
                        to={link.path}
                        className="text -paragraph-5 -color-8"
                        activeClassName="active"
                      >
                        {link.label}
                      </NavLink>
                    );
                  }
                  return <li key={link.label}>{LinkComponent}</li>;
                })}
            </ul>
          </div>
        </div>
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
  handleClick: PropTypes.func,
  activeLink: PropTypes.string
};

export default SubNavMenu;
