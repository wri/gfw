import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SCREEN_L } from 'utils/constants';
import cx from 'classnames';

import Icon from 'components/ui/icon';

import gfwLogo from 'assets/logos/gfw.png';
import moreIcon from 'assets/icons/more.svg';
import myGfwIcon from 'assets/icons/mygfw.svg';
import closeIcon from 'assets/icons/close.svg';
import arrowIcon from 'assets/icons/arrow-down.svg';

import MyGFW from './components/mygfw';
import LangSelector from './components/language-selector';
import SubmenuPanel from './components/submenu-panel';

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
      activeLang,
      navMain,
      apps,
      moreLinks,
      fullScreen,
      loggedIn
    } = this.props;
    const isMobile = window.innerWidth < SCREEN_L;

    return (
      (!fullScreen || (fullScreen && showHeader)) && (
        <div
          className={`c-header ${
            fullScreen ? '-full-screen' : ''
          } ${className || ''}`}
        >
          <div className="nav-menu">
            <div className={!fullScreen ? 'row column' : ''}>
              {fullScreen ? (
                <button onClick={toggleMenu} className="logo">
                  <img
                    src={gfwLogo}
                    alt="Global Forest Watch"
                    width="76"
                    height="76"
                  />
                </button>
              ) : (
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
                {!isMobile && (
                  <ul
                    className="nav-main"
                    onClick={() => {
                      setShowMyGfw(false);
                      setShowLangSelector(false);
                    }}
                    role="button" // eslint-disable-line
                  >
                    {navMain.map(item => (
                      <li key={item.label}>
                        <a href={item.path} className="ext-link">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <ul className={cx('nav-alt', { '-mobile': isMobile })}>
                  {!isMobile && (
                    <li>
                      <button
                        className="menu-link"
                        onClick={() => setShowLangSelector(!showLangSelector)}
                      >
                        {(activeLang && activeLang.name) || 'English'}
                        <Icon className="icon-arrow" icon={arrowIcon} />
                      </button>
                      {showLangSelector && (
                        <LangSelector
                          className="sub-menu"
                          languages={languages}
                          handleLangSelect={handleLangSelect}
                        />
                      )}
                    </li>
                  )}
                  {!isMobile && (
                    <li>
                      {loggedIn ? (
                        <a className="ext-link" href="/my_gfw">
                          My GFW
                          <Icon icon={moreIcon} />
                        </a>
                      ) : (
                        <button
                          className="menu-link"
                          onClick={() => setShowMyGfw(!showMyGfw)}
                        >
                          My GFW
                          <Icon icon={myGfwIcon} />
                        </button>
                      )}
                      {showMyGfw && <MyGFW className="sub-menu" />}
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
                      {fullScreen ? 'Close' : 'More'}
                      <Icon
                        className={showPanel ? 'icon-close' : 'icon-more'}
                        icon={showPanel ? closeIcon : moreIcon}
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
              isMobile={isMobile}
              onClick={() => {
                setShowMyGfw(false);
                setShowLangSelector(false);
              }}
            />
          )}
        </div>
      )
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  setShowPanel: PropTypes.func,
  setShowMyGfw: PropTypes.func,
  setShowLangSelector: PropTypes.func,
  showPanel: PropTypes.bool,
  showMyGfw: PropTypes.bool,
  showLangSelector: PropTypes.bool,
  handleLangSelect: PropTypes.func,
  languages: PropTypes.array,
  activeLang: PropTypes.object,
  navMain: PropTypes.array,
  apps: PropTypes.array,
  moreLinks: PropTypes.array,
  fullScreen: PropTypes.bool,
  showHeader: PropTypes.bool,
  toggleMenu: PropTypes.func,
  loggedIn: PropTypes.bool
};

export default Header;
