import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

import { Media } from 'utils/responsive';
import { APP_URL } from 'utils/constants';
import moment from 'moment';
import { getMomentLangCode } from 'utils/lang';

import Icon from 'components/ui/icon';
import DropdownMenu from 'components/header/components/dropdown-menu';
import SubmenuPanel from 'components/header/components/submenu-panel';

import arrowIcon from 'assets/icons/arrow-down.svg?sprite';
import myGfwIcon from 'assets/icons/mygfw.svg?sprite';
import closeIcon from 'assets/icons/close.svg?sprite';
import moreIcon from 'assets/icons/more.svg?sprite';
import menuIcon from 'assets/icons/menu.svg?sprite';

import './styles.scss';

class NavAlt extends PureComponent {
  static propTypes = {
    loggedIn: PropTypes.bool,
    loggingIn: PropTypes.bool,
    showSubmenu: PropTypes.bool,
    closeSubMenu: PropTypes.func,
    NavLinkComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  state = {
    lang: 'en',
    languages: [],
    showLang: false,
    showMore: false,
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;

    if (
      typeof window !== 'undefined' &&
      window.Transifex &&
      window.Transifex.live
    ) {
      const languages = window.Transifex.live.getAllLanguages();
      this.setState({
        lang: window.Transifex.live.detectLanguage(),
        languages:
          languages && languages.map((l) => ({ label: l.name, value: l.code })),
      });
    }
    moment.locale(getMomentLangCode(this.state.lang));
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { showMore } = this.state;
    if (prevState.showMore && !showMore) {
      document.body.classList.remove('Header__no-scroll');
    } else if (!prevState.showMore && showMore) {
      document.body.classList.add('Header__no-scroll');
    }
  }

  handleLangSelect = (lang) => {
    if (window.Transifex) {
      window.Transifex.live.translateTo(lang);
      this.setState({ lang, showLang: false, showMore: false });
    }
    moment.locale(getMomentLangCode(lang));
  };

  handleCloseSubmenu = () => {
    this.setState({ showMore: false });
    this.props.closeSubMenu();
  };

  render() {
    const { showSubmenu, loggedIn, loggingIn, NavLinkComponent } = this.props;
    const { showLang, showMore, lang, languages } = this.state;
    const activeLang = languages && languages.find((l) => l.value === lang);
    const showMorePanel = showMore || showSubmenu;

    return (
      <ul className={cx('c-nav-alt', { 'full-screen': showSubmenu })}>
        <Media greaterThanOrEqual="md" className="desktop-menu">
          <Fragment>
            <li className="alt-link">
              <OutsideClickHandler
                onOutsideClick={() => this.setState({ showLang: false })}
              >
                <Fragment>
                  <button
                    className="menu-link lang-btn notranslate"
                    onClick={() => {
                      if (this.mounted) {
                        this.setState({ showLang: !showLang });
                      }
                    }}
                    aria-label="translate"
                  >
                    {activeLang && <span>{activeLang.label}</span>}
                    <Icon
                      className={cx('icon-arrow', {
                        active: showLang,
                      })}
                      icon={arrowIcon}
                    />
                  </button>
                  {showLang && (
                    <DropdownMenu
                      className="submenu notranslate"
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
              {NavLinkComponent ? (
                <NavLinkComponent
                  href="/my-gfw"
                  className={cx('nav-link', {
                    'animate-user-icon': !loggedIn && loggingIn,
                  })}
                  activeClassName="active"
                >
                  My GFW
                  <Icon
                    icon={myGfwIcon}
                    className={cx({ 'logged-in': loggedIn })}
                  />
                </NavLinkComponent>
              ) : (
                <a
                  href={`${APP_URL}/my-gfw`}
                  className={cx(
                    'nav-link',
                    { 'animate-user-icon': !loggedIn && loggingIn },
                    {
                      active:
                        typeof window !== 'undefined' &&
                        window.location.pathname.includes('my-gfw'),
                    }
                  )}
                >
                  My GFW
                  <Icon
                    icon={myGfwIcon}
                    className={cx({ 'logged-in': loggedIn })}
                  />
                </a>
              )}
            </li>
          </Fragment>
        </Media>
        <li className="alt-link">
          <OutsideClickHandler
            onOutsideClick={() => this.setState({ showMore: false })}
          >
            <button
              className="menu-link submenu-link"
              onClick={() => {
                if (showSubmenu) {
                  this.handleCloseSubmenu();
                } else {
                  this.setState({ showMore: !showMore });
                }
              }}
            >
              <Media greaterThanOrEqual="md" className="menu-link">
                {showMorePanel ? 'close' : 'more'}
                <Icon
                  className={showMorePanel ? 'icon-close' : 'icon-more'}
                  icon={showMorePanel ? closeIcon : moreIcon}
                />
              </Media>
              <Media lessThan="md" className="menu-link">
                {showMorePanel ? 'close' : 'menu'}
                <Icon
                  className={showMorePanel ? 'icon-close' : 'icon-menu'}
                  icon={showMorePanel ? closeIcon : menuIcon}
                />
              </Media>
            </button>
            {showMorePanel && (
              <SubmenuPanel
                className="submenu-panel"
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

export default NavAlt;
