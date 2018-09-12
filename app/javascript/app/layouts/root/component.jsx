import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/ui/loader';
import universal from 'react-universal-component';
import cx from 'classnames';

import Header from 'components/header';
import MapMenu from 'pages/map/components/menu';
import MyGFWProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';
import './styles.scss';

const universalOptions = {
  loading: <Loader className="page-loader" />,
  minDelay: 2000000000000
};

const PageComponent = universal(
  ({ path } /* webpackChunkName: "[request]" */) =>
    import(`../../../pages/${path}/index.js`),
  universalOptions
);

class App extends PureComponent {
  render() {
    const { route, loggedIn } = this.props;
    const isMapPage = route.component === 'map';
    return (
      <div className={cx('l-root', { '-map': isMapPage })}>
        {route.headerOptions && (
          <Header loggedIn={loggedIn} {...route.headerOptions} />
        )}
        {isMapPage && <MapMenu />}
        <div className="page">
          <PageComponent path={route.component} sections={route.sections} />
        </div>
        <MyGFWProvider />
      </div>
    );
  }
}

App.propTypes = {
  route: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool
};

export default App;
