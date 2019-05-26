import React, { PureComponent } from 'react';
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
  state = {
    fullScreenOpen: false
  };

  componentDidUpdate(prevProps) {
    const { fullScreen } = this.props;
    if (fullScreen && !prevProps.fullScreen) {
      this.closeFullScreen();
    }
  }

  closeFullScreen = () => {
    this.setState({ fullScreenOpen: false });
  };

  render() {
    const {
      className,
      hideMenu,
      navMain,
      moreLinks,
      myGfwLinks,
      apps,
      setModalContactUsOpen,
      loggedIn,
      fullScreen
    } = this.props;
    const { fullScreenOpen } = this.state;

    return (
      <MediaQuery minWidth={SCREEN_MOBILE}>
        {isDesktop => (
          <div
            className={cx(
              'c-header',
              { 'full-screen': fullScreen },
              { 'full-screen-open': fullScreenOpen },
              className
            )}
          >
            <div className="row">
              <div className="column small-12">
                {!fullScreen || fullScreenOpen ? (
                  <a className="logo" href="/">
                    <img
                      src={gfwLogo}
                      alt="Global Forest Watch"
                      width="76"
                      height="76"
                    />
                  </a>
                ) : (
                  <button
                    className="logo"
                    onClick={() => this.setState({ fullScreenOpen: true })}
                  >
                    <img
                      src={gfwLogo}
                      alt="Global Forest Watch"
                      width="76"
                      height="76"
                    />
                  </button>
                )}
                {(!fullScreen || fullScreenOpen) && (
                  <div className="nav">
                    {isDesktop &&
                      !hideMenu && (
                        <NavMenu
                          className="nav-menu"
                          menuItems={navMain}
                          fullScreen={fullScreen}
                        />
                      )}
                    <NavAlt
                      showSubmenu={fullScreen && fullScreenOpen}
                      closeSubMenu={() =>
                        this.setState({ fullScreenOpen: false })
                      }
                      isDesktop={isDesktop}
                      myGfwLinks={myGfwLinks}
                      moreLinks={moreLinks}
                      navMain={navMain}
                      apps={apps}
                      toggleContactUs={setModalContactUsOpen}
                      loggedIn={loggedIn}
                    />
                  </div>
                )}
              </div>
            </div>
            <ContactUs />
          </div>
        )}
      </MediaQuery>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  setModalContactUsOpen: PropTypes.func,
  myGfwLinks: PropTypes.array,
  navMain: PropTypes.array,
  apps: PropTypes.array,
  moreLinks: PropTypes.array,
  fullScreen: PropTypes.bool,
  loggedIn: PropTypes.bool,
  hideMenu: PropTypes.bool
};

export default Header;
