import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import Search from 'components/ui/search';

import gfwLogo from 'assets/logos/gfw.png';
import moreIcon from 'assets/icons/more.svg';
import closeIcon from 'assets/icons/close.svg';
import arrowIcon from 'assets/icons/arrow-down.svg';

import MyGFW from './components/mygfw';
import LangSelector from './components/lang-selector';

import config from './config';

import './styles.scss';

class Header extends PureComponent {
  render() {
    const {
      className,
      setShowPanel,
      setShowMyGfw,
      setLangSelector,
      showPanel,
      showMyGfw,
      showLangSelector,
      isLoggedIn
    } = this.props;
    const { navMain } = config;

    return (
      <div className={`c-header ${className || ''}`}>
        <div className="nav-menu">
          <div className="row column">
            <div className="nav">
              <ul className="nav-main">
                <a className="logo" href="/">
                  <img src={gfwLogo} alt="Global Forest Watch" width="76" height="76" />
                </a>
                {navMain.map(item => (
                  <li key={item.label}>
                    <a href={item.path}>{item.label}</a>
                  </li>
                ))}
              </ul>
              <ul className="nav-alt">
                <li>
                  <button onClick={() => setLangSelector(!showLangSelector)}>
                    English
                    <Icon className="icon-arrow" icon={arrowIcon} />
                  </button>
                  {showLangSelector &&
                    <LangSelector className="sub-menu" />
                  }
                </li>
                <li>
                  {isLoggedIn ?
                    <a href="/my-gfw">
                      My GFW
                      <Icon icon={moreIcon} />
                    </a>
                    :
                    <button onClick={() => setShowMyGfw(!showMyGfw)}>
                      My GFW
                      <Icon icon={moreIcon} />
                    </button>
                  }
                  {showMyGfw &&
                    <MyGFW className="sub-menu" />
                  }
                </li>
                <li>
                  <button onClick={() => setShowPanel(!showPanel)}>
                    More
                    <Icon className={showPanel ? 'icon-close' : 'icon-more'} icon={showPanel ? closeIcon : moreIcon} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {showPanel &&
          <div className="nav-panel">
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
        }
      </div>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
