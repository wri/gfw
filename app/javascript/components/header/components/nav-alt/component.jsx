import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

import Icon from 'components/ui/icon';
import DropdownMenu from 'components/header/components/dropdown-menu';
import MyGFWLogin from 'components/mygfw-login';
import SubmenuPanel from 'components/header/components/submenu-panel';

import arrowIcon from 'assets/icons/arrow-down.svg';
import myGfwIcon from 'assets/icons/mygfw.svg';
import closeIcon from 'assets/icons/close.svg';
import moreIcon from 'assets/icons/more.svg';
import menuIcon from 'assets/icons/menu.svg';

import './styles.scss';

class NavAlt extends PureComponent {
  constructor(props) {
    super(props);

    const txData = JSON.parse(localStorage.getItem('txlive:languages'));
    const txLang = JSON.parse(localStorage.getItem('txlive:selectedlang'));
    const languages =
      txData &&
      txData.source &&
      [txData.source].concat(txData.translation).map(l => ({
        label: l.name,
        value: l.code
      }));

    this.state = {
      showHeader: false,
      languages,
      lang: txLang || 'en',
      showLang: false,
      showMyGfw: false,
      showMore: false
    };
  }

  handleLangSelect = lang => {
    localStorage.setItem('txlive:selectedlang', `"${lang}"`);
    window.Transifex.live.translateTo(lang);
    this.setState({ lang, showLang: false, showMore: false });
  };

  handleCloseSubmenu = () => {
    this.setState({ showMore: false });
    this.props.closeSubMenu();
  };

  render() {
    const { isDesktop, myGfwLinks, loggedIn, showSubmenu } = this.props;
    const { showLang, showMyGfw, showMore, languages, lang } = this.state;
    const activeLang = languages && languages.find(l => l.value === lang);
    const showMorePanel = showMore || showSubmenu;
    let moreMenuText = 'menu';
    if (showSubmenu && isDesktop) {
      moreMenuText = 'close';
    } else if (isDesktop) {
      moreMenuText = 'more';
    }

    return (
      <ul className={cx('c-nav-alt', { 'full-screen': showSubmenu })}>
        {isDesktop && (
          <Fragment>
            <li className="alt-link">
              <OutsideClickHandler
                onOutsideClick={() => this.setState({ showLang: false })}
              >
                <Fragment>
                  <button
                    className="menu-link lang-btn"
                    onClick={() => this.setState({ showLang: !showLang })}
                  >
                    {(activeLang && activeLang.label) || 'English'}
                    <Icon
                      className={cx('icon-arrow', {
                        active: showLang
                      })}
                      icon={arrowIcon}
                    />
                  </button>
                  {showLang && (
                    <DropdownMenu
                      className="submenu"
                      options={languages}
                      selected={activeLang}
                      handleSelect={this.handleLangSelect}
                      hideMenu={() => this.setState({ showLang: false })}
                    />
                  )}
                </Fragment>
              </OutsideClickHandler>
            </li>
            <li className="alt-link">
              <OutsideClickHandler
                onOutsideClick={() => this.setState({ showMyGfw: false })}
              >
                <button
                  className="menu-link"
                  onClick={() => this.setState({ showMyGfw: !showMyGfw })}
                >
                  My GFW
                  <Icon icon={myGfwIcon} />
                  {showMyGfw &&
                    loggedIn && (
                      <DropdownMenu className="submenu" options={myGfwLinks} />
                    )}
                  {showMyGfw &&
                    !loggedIn && (
                      <MyGFWLogin className="mygfw-header submenu" />
                    )}
                </button>
              </OutsideClickHandler>
            </li>
          </Fragment>
        )}
        <li className="alt-link">
          <OutsideClickHandler
            onOutsideClick={() => this.setState({ showMore: false })}
          >
            <button
              className="menu-link"
              onClick={() => {
                if (showSubmenu) {
                  this.handleCloseSubmenu();
                } else {
                  this.setState({ showMore: !showMore });
                }
              }}
            >
              {moreMenuText}
              {isDesktop && (
                <Icon
                  className={showMorePanel ? 'icon-close' : 'icon-more'}
                  icon={showMorePanel ? closeIcon : moreIcon}
                />
              )}
              {!isDesktop && (
                <Icon
                  className={showMorePanel ? 'icon-close' : 'icon-menu'}
                  icon={showMorePanel ? closeIcon : menuIcon}
                />
              )}
            </button>
            {showMorePanel && (
              <SubmenuPanel
                className="submenu-panel"
                isMobile={!isDesktop}
                languages={languages}
                activeLang={activeLang}
                handleLangSelect={this.handleLangSelect}
                hideMenu={this.handleCloseSubmenu}
                {...this.props}
              />
            )}
          </OutsideClickHandler>
        </li>
      </ul>
    );
  }
}

NavAlt.propTypes = {
  isDesktop: PropTypes.bool,
  myGfwLinks: PropTypes.array,
  loggedIn: PropTypes.bool,
  showSubmenu: PropTypes.bool,
  closeSubMenu: PropTypes.func
};

export default NavAlt;
