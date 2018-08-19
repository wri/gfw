import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import Search from 'components/ui/search';

import moreIcon from 'assets/icons/more.svg';

import './styles.scss';

class Header extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { className, apps, moreLinks, fullScreen } = this.props;

    return (
      <div
        className={`c-submenu-panel ${
          fullScreen ? '-full-screen' : ''
        } ${className || ''}`}
      >
        <div className="row">
          <div className="column small-12 medium-10 medium-offset-1">
            <form onSubmit={this.handleSubmit}>
              <Search className="menu-search" placeholder="Search" />
            </form>
            <div className="menu-section">
              <h4>Other applications</h4>
              <div className="apps-slider">
                {apps &&
                  apps.map(d => (
                    <a
                      key={d.label}
                      href={d.path}
                      target="_blank"
                      rel="noopener nofollower"
                      className="app-card"
                    >
                      <div
                        className="app-image"
                        style={{ backgroundImage: `url('${d.image}')` }}
                      />
                    </a>
                  ))}
                <a
                  href="https://developers.globalforestwatch.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-card"
                >
                  <div className="all-apps">
                    <Icon className="icon-more" icon={moreIcon} />
                    Explore all apps
                  </div>
                </a>
              </div>
            </div>
            <div className="menu-section">
              <h4>More in GFW</h4>
              <ul className="more-links row">
                {moreLinks.map(m => (
                  <li
                    key={m.label}
                    className="column small-12 medium-4 large-3"
                  >
                    <a href={m.path} target="_blank" rel="noopener noreferrer">
                      <Icon icon={m.icon} />
                      {m.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <a className="title" href="/sitemap">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  apps: PropTypes.array,
  moreLinks: PropTypes.array,
  fullScreen: PropTypes.bool
};

export default Header;
