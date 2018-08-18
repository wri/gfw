import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import Search from 'components/ui/search';

import './styles.scss';

class Header extends PureComponent {
  render() {
    const {
      className
    } = this.props;

    return (
      <div className={`c-submenu-panel ${className || ''}`}>
        <div className="row">
          <div className="column small-8 small-offset-2">
            <Search className="menu-search" placeholder="Search" />
            <div className="menu-section">
              <h4>Other applications</h4>
            </div>
            <div className="menu-section">
              <h4>More in GFW</h4>
              <ul className="more-links row column">
                <li className="small-12 medium-4 large-3">Developer Tools</li>
                <li className="small-12 medium-4 large-3">How to Portal</li>
                <li className="small-12 medium-4 large-3">Small Grants Fund</li>
                <li className="small-12 medium-4 large-3">Open Data Portal</li>
                <li className="small-12 medium-4 large-3">Contribute Data</li>
              </ul>
            </div>
            <div className="menu-section">
              <a href="/sitemap">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
