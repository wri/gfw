import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { NavLink } from 'redux-first-router-link';

import Icon from 'components/ui/icon';
import Search from 'components/ui/search';

import moreIcon from 'assets/icons/more.svg';
import myGfwIcon from 'assets/icons/mygfw.svg';

import DropdownMenu from '../dropdown-menu';

import './styles.scss';

class Header extends PureComponent {
  state = {
    search: ''
  };

  handleSubmit = () => {
    const { setQueryToUrl, hideMenu } = this.props;
    setQueryToUrl({ query: this.state.search });
    hideMenu();
  };

  handleSearchChange = search => {
    this.setState({ search });
  };

  render() {
    const {
      className,
      apps,
      moreLinks,
      showSubmenu,
      onClick,
      isMobile,
      navMain,
      activeLang,
      languages,
      handleLangSelect,
      loggedIn,
      toggleContactUs,
      hideMenu
    } = this.props;

    return (
      <div
        className={cx(
          'c-submenu-panel',
          { 'full-screen': showSubmenu },
          className
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className="submenu-wrapper">
          <Search
            className="menu-search"
            placeholder="Search"
            onChange={this.handleSearchChange}
            onSubmit={this.handleSubmit}
          />
          {isMobile && (
            <div className="menu-section">
              <DropdownMenu
                className="sub-menu -plain"
                options={navMain}
                hideMenu={hideMenu}
              />
              <NavLink
                className="nav-link my-gfw-link"
                to="/my-gfw"
                activeClassName="active"
                onClick={() => hideMenu()}
              >
                My GFW
                <Icon
                  icon={myGfwIcon}
                  className={cx({ 'logged-in': loggedIn })}
                />
              </NavLink>
            </div>
          )}
          {isMobile && (
            <div className="menu-section">
              <h4>Select a language</h4>
              <DropdownMenu
                className="sub-menu -plain"
                options={languages}
                selected={activeLang}
                handleSelect={lang => {
                  handleLangSelect(lang);
                }}
              />
            </div>
          )}
          {isMobile &&
            !loggedIn && (
            <div className="menu-section">
              <NavLink className="nav-link" to="/my-gfw">
                  My GFW
              </NavLink>
            </div>
          )}
          <div className="menu-section">
            <h4>Other applications</h4>
            <div className="apps-slider">
              {apps &&
                apps.map(d => (
                  <a
                    key={d.label}
                    href={d.extLink}
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
            <ul className="row more-links">
              {moreLinks.map(m => (
                <li key={m.label} className="column small-12 medium-4 large-3">
                  {m.path ? (
                    <NavLink to={m.path} onClick={hideMenu}>
                      <Icon icon={m.icon} />
                      {m.label}
                    </NavLink>
                  ) : (
                    <a
                      href={m.extLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon icon={m.icon} />
                      {m.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="legal-section">
            <NavLink className="title" to="/terms" onClick={hideMenu}>
              Terms
            </NavLink>
            <NavLink className="title" to="/privacy-policy" onClick={hideMenu}>
              Privacy Policy
            </NavLink>
            <button className="title" onClick={() => toggleContactUs(true)}>
              Contact us
            </button>
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
  showSubmenu: PropTypes.bool,
  onClick: PropTypes.func,
  isMobile: PropTypes.bool,
  navMain: PropTypes.array,
  activeLang: PropTypes.object,
  languages: PropTypes.array,
  hideMenu: PropTypes.func,
  handleLangSelect: PropTypes.func,
  toggleContactUs: PropTypes.func,
  loggedIn: PropTypes.bool,
  setQueryToUrl: PropTypes.func
};

export default Header;
