import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'components/ui/icon';

import gfwLogo from 'assets/logos/gfw.png';
import moreIcon from 'assets/icons/more.svg';
import menuIcon from 'assets/icons/menu.svg';
import myGfwIcon from 'assets/icons/mygfw.svg';
import closeIcon from 'assets/icons/close.svg';
import arrowIcon from 'assets/icons/arrow-down.svg';

import ContactUs from 'components/modals/contact-us';
import MyGFWLogin from 'components/mygfw-login';
import DropdownMenu from './components/dropdown-menu';
import SubmenuPanel from './components/submenu-panel';
import NavMenu from './components/nav-menu';

import './styles.scss';

class Header extends PureComponent {
  render() {
    const {
      className,
      setShowPanel,
      setShowMyGfw,
      setShowLangSelector,
      showPanel,
      showMyGfw,
      showLangSelector,
      handleLangSelect,
      showHeader,
      toggleMenu,
      languages,
      myGfwLinks,
      activeLang,
      navMain,
      apps,
      moreLinks,
      fullScreen,
      loggedIn,
      fixed,
      toggle,
      isMobile,
      isMap,
      setModalContactUsOpen
    } = this.props;

    let moreText = fullScreen ? 'close' : 'more';
    if (!fullScreen && isMobile) {
      moreText = 'menu';
    }
    let moreMenuIcon = fullScreen || showPanel ? closeIcon : moreIcon;
    let moreMenuClassName =
      fullScreen || showPanel ? 'icon-close' : 'icon-more';
    if (isMobile && !fullScreen && !showPanel) {
      moreMenuIcon = menuIcon;
      moreMenuClassName = 'icon-menu';
    }

    return (
      <div
        className={cx(
          'c-header',
          { '-full-screen': fullScreen },
          { '-fixed': fixed },
          { '-toggle': toggle },
          { '-open': showHeader },
          { '-small': isMap && isMobile },
          { '-sticky': !isMap && isMobile },
          className
        )}
      >
        {toggle &&
          !showHeader && (
            <button onClick={toggleMenu} className="logo">
              <img src={gfwLogo} alt="Global Forest Watch" />
            </button>
          )}
        {(!toggle || (toggle && showHeader)) && (
          <Fragment>
            <div className="nav-menu">
              <div className={!fullScreen ? 'row column' : ''}>
                {(!toggle || (toggle && showHeader)) && (
                  <a className="logo" href="/">
                    <img
                      src={gfwLogo}
                      alt="Global Forest Watch"
                      width="76"
                      height="76"
                    />
                  </a>
                )}
                <div className="nav">
                  {!isMobile && <NavMenu menuItems={navMain} />}
                  <ul className={cx('nav-alt', { '-mobile': isMobile })}>
                    {!isMobile && (
                      <li>
                        <button
                          className="menu-link"
                          onClick={() => setShowLangSelector(!showLangSelector)}
                        >
                          {(activeLang && activeLang.label) || 'English'}
                          <Icon
                            className={cx('icon-arrow', {
                              active: showLangSelector
                            })}
                            icon={arrowIcon}
                          />
                        </button>
                        {showLangSelector && (
                          <DropdownMenu
                            className="sub-menu"
                            options={languages}
                            handleSelect={handleLangSelect}
                          />
                        )}
                      </li>
                    )}
                    {!isMobile && (
                      <li>
                        <button
                          className="menu-link"
                          onClick={() => setShowMyGfw(!showMyGfw)}
                        >
                          My GFW
                          <Icon icon={myGfwIcon} />
                        </button>
                        {showMyGfw &&
                          loggedIn && (
                            <DropdownMenu
                              className="sub-menu"
                              options={myGfwLinks}
                            />
                          )}
                        {showMyGfw &&
                          !loggedIn && (
                            <MyGFWLogin className="mygfw-header sub-menu" />
                          )}
                      </li>
                    )}
                    <li>
                      <button
                        className="menu-link"
                        onClick={
                          fullScreen
                            ? () => {
                              toggleMenu();
                              setShowPanel(false);
                            }
                            : () => setShowPanel(!showPanel)
                        }
                      >
                        {moreText}
                        <Icon
                          className={moreMenuClassName}
                          icon={moreMenuIcon}
                        />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {showPanel && (
              <SubmenuPanel
                apps={apps}
                moreLinks={moreLinks}
                fullScreen={fullScreen}
                navMain={navMain}
                languages={languages}
                activeLang={activeLang}
                myGfwLinks={myGfwLinks}
                isMobile={isMobile}
                loggedIn={loggedIn}
                toggleMenu={toggleMenu}
                onClick={() => {
                  setShowMyGfw(false);
                  setShowLangSelector(false);
                }}
                handleShowContactUs={() => setModalContactUsOpen(true)}
                setShowPanel={setShowPanel}
                handleLangSelect={handleLangSelect}
              />
            )}
          </Fragment>
        )}
        <ContactUs />
      </div>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  setShowPanel: PropTypes.func,
  setShowMyGfw: PropTypes.func,
  setShowLangSelector: PropTypes.func,
  setModalContactUsOpen: PropTypes.func,
  showPanel: PropTypes.bool,
  showMyGfw: PropTypes.bool,
  showLangSelector: PropTypes.bool,
  handleLangSelect: PropTypes.func,
  languages: PropTypes.array,
  activeLang: PropTypes.object,
  myGfwLinks: PropTypes.array,
  navMain: PropTypes.array,
  apps: PropTypes.array,
  moreLinks: PropTypes.array,
  fullScreen: PropTypes.bool,
  showHeader: PropTypes.bool,
  toggleMenu: PropTypes.func,
  loggedIn: PropTypes.bool,
  fixed: PropTypes.bool,
  toggle: PropTypes.bool,
  isMobile: PropTypes.bool,
  isMap: PropTypes.bool
};

export default Header;
