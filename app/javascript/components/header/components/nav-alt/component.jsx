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
      lang: txLang,
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

  render() {
    const { isDesktop, myGfwLinks, loggedIn } = this.props;
    const { showLang, showMyGfw, showMore, languages, lang } = this.state;
    const activeLang = languages && languages.find(l => l.value === lang);

    return (
      <ul className="c-nav-alt">
        {isDesktop && (
          <Fragment>
            <li className="alt-link">
              <OutsideClickHandler
                onOutsideClick={() => this.setState({ showLang: false })}
              >
                <Fragment>
                  <button
                    className="menu-link"
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
              onClick={() => this.setState({ showMore: !showMore })}
            >
              {isDesktop ? 'More' : 'Menu'}
              {isDesktop && (
                <Icon
                  className={showMore ? 'icon-close' : 'icon-more'}
                  icon={showMore ? closeIcon : moreIcon}
                />
              )}
              {!isDesktop && (
                <Icon
                  className={showMore ? 'icon-close' : 'icon-menu'}
                  icon={showMore ? closeIcon : menuIcon}
                />
              )}
            </button>
            {showMore && (
              <SubmenuPanel
                className="submenu-panel"
                isMobile={!isDesktop}
                languages={languages}
                activeLang={activeLang}
                handleLangSelect={this.handleLangSelect}
                hideMenu={() => this.setState({ showMore: false })}
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
  loggedIn: PropTypes.bool
};

export default NavAlt;
