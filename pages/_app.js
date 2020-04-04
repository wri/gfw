import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import finallyShim from 'promise.prototype.finally';
import reducerRegistry from 'app/registry';
import { combineReducers } from 'redux';

import routes from 'app/routes';
import makeStore from 'lib/with-redux-store';

import MyGFWProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';

finallyShim.shim();

class MyApp extends App {
  store = makeStore();

  componentDidMount() {
    this.store.replaceReducer(combineReducers(reducerRegistry.getReducers()));
  }

  componentDidUpdate() {
    this.store.replaceReducer(combineReducers(reducerRegistry.getReducers()));
  }

  render() {
    const { Component, router, pageProps } = this.props;
    const { route } = router;
    const routeConfig = routes[route];

    return (
      <Provider store={this.store}>
        <MyGFWProvider />
        <Component {...routeConfig} {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;
