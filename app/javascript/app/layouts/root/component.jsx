import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';
import universal from 'react-universal-component';
import cx from 'classnames';
import { handlePageTrack } from 'app/analytics';

import Loader from 'components/ui/loader';
import Meta from 'components/meta';
import Header from 'components/header';
import Footer from 'components/footer';
import Cookies from 'components/cookies';
import Button from 'components/ui/button';
import MapMenu from 'components/map-menu';
import ErrorPage from 'pages/error';
import MyGFWProvider from 'providers/mygfw-provider';
import gfwLogo from 'assets/logos/gfw.png';

import 'styles/styles.scss';
import './styles.scss';

const universalOptions = {
  loading: <Loader className="page-loader" />,
  minDelay: 200,
  error: (
    <ErrorPage
      title="Sorry, something went wrong."
      desc="Try refreshing the page or check your connection."
    />
  )
};

const PageComponent = universal(
  ({ path } /* webpackChunkName: "[request]" */) =>
    import(`../../../pages/${path}/index.js`),
  universalOptions
);

class App extends PureComponent {
  static propTypes = {
    route: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool,
    isGFW: PropTypes.bool,
    isTrase: PropTypes.bool,
    metadata: PropTypes.object,
    authenticating: PropTypes.bool
  };

  componentDidMount() {
    const isSearch = window.location.pathname === '/search';
    handlePageTrack(isSearch);
  }

  render() {
    const {
      route,
      loggedIn,
      metadata,
      isGFW,
      isTrase,
      authenticating
    } = this.props;
    const { component, embed, fullScreen } = route;
    const isMapPage = component === 'map';

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div
            className={cx('l-root', {
              '-full-screen': fullScreen,
              '-embed': embed,
              '-trase': isTrase
            })}
          >
            {!embed && <Header loggedIn={loggedIn} fullScreen={fullScreen} />}
            {embed && (
              <a className="page-logo" href="/" target="_blank">
                <img src={gfwLogo} alt="Global Forest Watch" />
              </a>
            )}
            {isMapPage && (
              <MapMenu
                className="map-menu"
                isDesktop={isDesktop}
                embed={embed}
              />
            )}
            <div className={cx('page', { mobile: !isDesktop && !isMapPage })}>
              {authenticating ? (
                <Loader className="page-loader" />
              ) : (
                <PageComponent
                  path={route.component}
                  sections={route.sections}
                  isTrase={isTrase}
                  isDesktop={isDesktop}
                  metadata={metadata}
                  loggedIn={loggedIn}
                />
              )}
            </div>
            {!embed && <MyGFWProvider />}
            {embed &&
              !isGFW &&
              !isTrase && (
              <div className="embed-footer">
                <p>For more info</p>
                <Button
                  className="embed-btn"
                  extLink={window.location.href.replace('/embed', '')}
                >
                    EXPLORE ON GFW
                </Button>
              </div>
            )}
            <Meta {...metadata} />
            <Cookies />
            {!route.hideFooter && !embed && <Footer />}
          </div>
        )}
      </MediaQuery>
    );
  }
}

export default App;
