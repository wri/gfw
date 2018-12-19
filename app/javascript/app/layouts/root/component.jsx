import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';
import Loader from 'components/ui/loader';
import universal from 'react-universal-component';
import cx from 'classnames';

import Meta from 'components/meta';
import Header from 'components/header';
import Button from 'components/ui/button';
import MapMenu from 'components/maps/components/menu';
import MyGFWProvider from 'providers/mygfw-provider';
import gfwLogo from 'assets/logos/gfw.png';

import 'styles/styles.scss';
import './styles.scss';

const universalOptions = {
  loading: <Loader className="page-loader" />,
  minDelay: 200
};

const PageComponent = universal(
  ({ path } /* webpackChunkName: "[request]" */) =>
    import(`../../../pages/${path}/index.js`),
  universalOptions
);

class App extends PureComponent {
  render() {
    const { route, loggedIn, metadata, isGFW, isTrase } = this.props;
    const { component, embed } = route;
    const isMapPage = component === 'map';
    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div
            className={cx('l-root', { '-map': isMapPage }, { '-embed': embed })}
          >
            {!embed &&
              route.headerOptions && (
                <Header
                  className={cx('map-tour-main-menu')}
                  isMobile={!isDesktop}
                  loggedIn={loggedIn}
                  {...route.headerOptions}
                />
              )}
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
            <div className="page">
              <PageComponent
                path={route.component}
                sections={route.sections}
                isTrase={isTrase}
              />
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
          </div>
        )}
      </MediaQuery>
    );
  }
}

App.propTypes = {
  route: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool,
  isGFW: PropTypes.bool,
  isTrase: PropTypes.bool,
  metadata: PropTypes.object
};

export default App;
