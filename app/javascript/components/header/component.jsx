import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SCREEN_M } from 'utils/constants';
import MediaQuery from 'react-responsive';
import { NavLink } from 'redux-first-router-link';

import gfwLogo from 'assets/logos/gfw.png';
import ContactUs from 'components/modals/contact-us';
import ClimateModal from 'components/modals/climate';
import FiresModal from 'components/modals/fires';

import NavMenu from './components/nav-menu';
import NavAlt from './components/nav-alt';

import './styles.scss';

class Header extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    setModalContactUsOpen: PropTypes.func,
    navMain: PropTypes.array,
    apps: PropTypes.array,
    moreLinks: PropTypes.array,
    fullScreen: PropTypes.bool,
    loggedIn: PropTypes.bool,
    hideMenu: PropTypes.bool,
    setQueryToUrl: PropTypes.func,
    setLangToUrl: PropTypes.func,
    myGfwLinks: PropTypes.array
  };

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
      fullScreen,
      setQueryToUrl,
      setLangToUrl
    } = this.props;
    const { fullScreenOpen } = this.state;

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div
            className={cx(
              'c-header',
              { 'full-screen': fullScreen },
              { 'full-screen-open': fullScreenOpen },
              className
            )}
          >
            <div className={cx('row', { expanded: fullScreen })}>
              <div className="column small-12">
                {!fullScreen || fullScreenOpen ? (
                  <NavLink to="/" className="logo">
                    <img
                      src={gfwLogo}
                      alt="Global Forest Watch"
                      width="76"
                      height="76"
                    />
                  </NavLink>
                ) : (
                  <button
                    className="logo map-tour-main-menu"
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
                      moreLinks={moreLinks}
                      myGfwLinks={myGfwLinks}
                      navMain={navMain}
                      apps={apps}
                      toggleContactUs={setModalContactUsOpen}
                      loggedIn={loggedIn}
                      setQueryToUrl={setQueryToUrl}
                      setLangToUrl={setLangToUrl}
                    />
                  </div>
                )}
              </div>
            </div>
            <ContactUs />
            <ClimateModal />
            <FiresModal />
          </div>
        )}
      </MediaQuery>
    );
  }
}

export default Header;
