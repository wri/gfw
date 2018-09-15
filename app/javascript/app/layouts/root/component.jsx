import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/ui/loader';
import universal from 'react-universal-component';
import cx from 'classnames';

import Meta from 'components/meta';
import Header from 'components/header';
import Button from 'components/ui/button';
import MapMenu from 'pages/map/components/menu';
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
    const { route, loggedIn, metadata } = this.props;
    const { component, embed } = route;
    const isMapPage = component === 'map';
    return (
      <div className={cx('l-root', { '-map': isMapPage && !embed })}>
        {!embed &&
          route.headerOptions && (
            <Header loggedIn={loggedIn} {...route.headerOptions} />
          )}
        {embed && (
          <a className="logo" href="/" target="_blank">
            <img src={gfwLogo} alt="Global Forest Watch" />
          </a>
        )}
        {!embed && isMapPage && <MapMenu />}
        <div className="page">
          <PageComponent
            embed={embed}
            path={route.component}
            sections={route.sections}
          />
        </div>
        {!embed && <MyGFWProvider />}
        {embed && (
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
    );
  }
}

App.propTypes = {
  route: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool,
  metadata: PropTypes.object
};

export default App;
