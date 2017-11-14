import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link as AnchorLink } from 'react-scroll';
import RouterLink from 'redux-first-router-link';

import './subnav-menu-styles.scss';

class SubNavMenu extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { links } = this.props;
    return (
      <div className="c-subnav-menu">
        <div className="row">
          <div className="small-12 columns">
            <ul className="c-subnav-menu__buttons">
              {links.map(link => {
                const LinkComponent = link.anchor ? (
                  <AnchorLink
                    className="text -paragraph-5 -color-8"
                    to={link.anchor}
                    spy
                    smooth
                    duration={500}
                  >
                    {link.label}
                  </AnchorLink>
                ) : (
                  <RouterLink
                    to={link.path}
                    className="text -paragraph-5 -color-8"
                  >
                    {link.label}
                  </RouterLink>
                );
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
  ).isRequired
};

export default SubNavMenu;
