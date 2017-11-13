import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link as AnchorLink } from 'react-scroll';
import RouterLink from 'redux-first-router-link';

class SubNavMenu extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { links } = this.props;
    return (
      <div className="c-about-anchors">
        <div className="row">
          <div className="small-12 columns">
            <ul className="c-about-anchors__buttons">
              {links.map(link => {
                const child = (
                  <li className="text -paragraph-5 -color-8">{link.label}</li>
                );
                return link.anchor ? (
                  <AnchorLink
                    key={link.anchor}
                    to={link.anchor}
                    spy
                    smooth
                    duration={500}
                  >
                    {child}
                  </AnchorLink>
                ) : (
                  <RouterLink key={link.path} to={link.path}>
                    {child}
                  </RouterLink>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

SubNavMenu.propTypes = {
  links: PropTypes.array.isRequired
};

export default SubNavMenu;
