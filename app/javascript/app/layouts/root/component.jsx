import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/ui/loader';
import universal from 'react-universal-component';

import Header from 'components/header';
import MyGFWProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';
import './styles.scss';

const universalOptions = {
  loading: <Loader className="page-loader" />,
  minDelay: 200
};

const PageComponent = universal(
  ({ path } /* webpackChunkName: "[request]" */) =>
    import(`../../pages/${path}/index.js`),
  universalOptions
);

class App extends PureComponent {
  render() {
    const { route, loggedIn } = this.props;
    return (
      <div className="l-root">
        {route.headerOptions && (
          <Header loggedIn={loggedIn} {...route.headerOptions} />
        )}
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
