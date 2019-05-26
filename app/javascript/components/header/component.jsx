import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SCREEN_MOBILE } from 'utils/constants';
import MediaQuery from 'react-responsive';

import gfwLogo from 'assets/logos/gfw.png';
import ContactUs from 'components/modals/contact-us';

import NavMenu from './components/nav-menu';
import NavAlt from './components/nav-alt';

import './styles.scss';

class Header extends PureComponent {
  render() {
    const {
      className,
      showHeader,
      toggleMenu,
      navMain,
      moreLinks,
      fullScreen,
      // fixed,
      toggle,
      myGfwLinks,
      apps
    } = this.props;

    return (
      <MediaQuery minWidth={SCREEN_MOBILE}>
        {isDesktop => (
          <div
            className={cx(
              'c-header',
              { '-full-screen': fullScreen },
              { '-fixed': !isDesktop },
              { '-toggle': toggle },
              { '-open': showHeader },
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
                      {isDesktop && <NavMenu menuItems={navMain} />}
                      <NavAlt
                        isDesktop={isDesktop}
                        myGfwLinks={myGfwLinks}
                        moreLinks={moreLinks}
                        apps={apps}
                        navMain={navMain}
                      />
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
            <ContactUs />
          </div>
        )}
      </MediaQuery>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  // setModalContactUsOpen: PropTypes.func,
  myGfwLinks: PropTypes.array,
  navMain: PropTypes.array,
  apps: PropTypes.array,
  moreLinks: PropTypes.array,
  fullScreen: PropTypes.bool,
  showHeader: PropTypes.bool,
  toggleMenu: PropTypes.func,
  // loggedIn: PropTypes.bool,
  // fixed: PropTypes.bool,
  toggle: PropTypes.bool
  // isDesktop: PropTypes.bool,
  // isMap: PropTypes.bool
};

export default Header;
