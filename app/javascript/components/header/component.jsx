import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
      isLoggedIn,
      languages,
      activeLang,
      navMain
    } = this.props;

    return (
      <div className={`c-header ${className || ''}`}>
        <div className="nav-menu">
          <div className="row column">
            <div className="nav">
              <ul className="nav-main">
                <a className="logo" href="/">
                  <img
                    src={gfwLogo}
                    alt="Global Forest Watch"
                    width="76"
                    height="76"
                  />
                </a>
                {navMain.map(item => (
                  <li key={item.label}>
                    <a href={item.path} className="ext-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="nav-alt">
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
                <li>
                  {isLoggedIn ? (
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
                <li>
                  <button
                    className="menu-link"
                    onClick={() => setShowPanel(!showPanel)}
                  >
                    More
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
        {showPanel && <SubmenuPanel />}
      </div>
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
  isLoggedIn: PropTypes.bool,
  languages: PropTypes.array,
  activeLang: PropTypes.object,
  navMain: PropTypes.array
};

export default Header;
