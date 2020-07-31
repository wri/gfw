import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { APP_URL } from 'utils/constants';
import { Media } from 'utils/responsive';

import Icon from 'components/ui/icon';
import Search from 'components/ui/search';

import moreIcon from 'assets/icons/more.svg?sprite';
import myGfwIcon from 'assets/icons/mygfw.svg?sprite';

import DropdownMenu from '../dropdown-menu';

import './styles.scss';

class Header extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    apps: PropTypes.array,
    moreLinks: PropTypes.array,
    showSubmenu: PropTypes.bool,
    onClick: PropTypes.func,
    navMain: PropTypes.array,
    activeLang: PropTypes.object,
    languages: PropTypes.array,
    hideMenu: PropTypes.func,
    handleLangSelect: PropTypes.func,
    openContactUsModal: PropTypes.func,
    loggedIn: PropTypes.bool,
    setQueryToUrl: PropTypes.func,
    NavLinkComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  state = {
    search: '',
  };

  handleSubmit = () => {
    const { setQueryToUrl, hideMenu } = this.props;
    if (setQueryToUrl) {
      setQueryToUrl(this.state.search);
    } else {
      window.location.href = `https://www.globalforestwatch.org/search?query=${this.state.search}`;
    }
    hideMenu();
  };

  handleSearchChange = (search) => {
    this.setState({ search });
  };

  handleContactUsOpen = () => {
    const { openContactUsModal } = this.props;
    if (openContactUsModal) {
      openContactUsModal(true);
    } else {
      window.location.href = `https://www.globalforestwatch.org/search?query=${this.state.search}`;
    }
  };

  render() {
    const {
      className,
      apps,
      moreLinks,
      showSubmenu,
      onClick,
      navMain,
      activeLang,
      languages,
      handleLangSelect,
      loggedIn,
      hideMenu,
      NavLinkComponent,
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
          <Media lessThan="md" className="menu-section">
            <DropdownMenu
              className="sub-menu -plain"
              options={navMain}
              hideMenu={hideMenu}
              NavLinkComponent={NavLinkComponent}
            />
            {NavLinkComponent ? (
              <NavLinkComponent
                href="/my-gfw"
                activeClassName="active"
                className="nav-link my-gfw-link"
              >
                <button onClick={hideMenu}>
                  My GFW
                  <Icon
                    icon={myGfwIcon}
                    className={cx({ 'logged-in': loggedIn })}
                  />
                </button>
              </NavLinkComponent>
            ) : (
              <a
                href={`${APP_URL}/my-gfw`}
                className={cx('nav-link my-gfw-link', {
                  active:
                    typeof window !== 'undefined' &&
                    window.location.pathname.includes('my-gfw'),
                })}
              >
                <button onClick={hideMenu}>
                  My GFW
                  <Icon
                    icon={myGfwIcon}
                    className={cx({ 'logged-in': loggedIn })}
                  />
                </button>
              </a>
            )}
          </Media>
          <Media lessThan="md" className="menu-section">
            <h4>Select a language</h4>
            <DropdownMenu
              className="sub-menu -plain"
              options={languages}
              selected={activeLang}
              handleSelect={(lang) => {
                handleLangSelect(lang);
              }}
            />
          </Media>
          <div className="menu-section">
            <h4>Other applications</h4>
            <div className="apps-slider">
              {apps &&
                apps.map((d) => (
                  <a
                    key={d.label}
                    href={d.extLink}
                    target="_blank"
                    rel="noopener noreferrer"
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
              {moreLinks.map((m) => (
                <li key={m.label} className="column small-12 medium-4 large-3">
                  {m.href ? (
                    <Fragment>
                      {NavLinkComponent ? (
                        <NavLinkComponent href={m.href}>
                          <button onClick={hideMenu}>
                            <Icon icon={m.icon} />
                            {m.label}
                          </button>
                        </NavLinkComponent>
                      ) : (
                        <a
                          href={`${APP_URL}${m.href}`}
                          className={cx({
                            active:
                              typeof window !== 'undefined' &&
                              window.location.pathname.includes(m.href),
                          })}
                        >
                          <button onClick={hideMenu}>
                            <Icon icon={m.icon} />
                            {m.label}
                          </button>
                        </a>
                      )}
                    </Fragment>
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
            {NavLinkComponent ? (
              <NavLinkComponent href="/terms">
                <button onClick={hideMenu} className="title">
                  Terms
                </button>
              </NavLinkComponent>
            ) : (
              <a href={`${APP_URL}/terms`}>
                <button onClick={hideMenu} className="title">
                  Terms
                </button>
              </a>
            )}
            {NavLinkComponent ? (
              <NavLinkComponent href="/privacy-policy">
                <button onClick={hideMenu} className="title">
                  Privacy Policy
                </button>
              </NavLinkComponent>
            ) : (
              <a href={`${APP_URL}/privacy-policy`}>
                <button onClick={hideMenu} className="title">
                  Privacy Policy
                </button>
              </a>
            )}
            <button className="title" onClick={this.handleContactUsOpen}>
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
  navMain: PropTypes.array,
  activeLang: PropTypes.object,
  languages: PropTypes.array,
  hideMenu: PropTypes.func,
  handleLangSelect: PropTypes.func,
  openContactUsModal: PropTypes.func,
  loggedIn: PropTypes.bool,
  setQueryToUrl: PropTypes.func,
  NavLinkComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default Header;
