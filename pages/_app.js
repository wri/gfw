import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import isEmpty from 'lodash/isEmpty';

import finallyShim from 'promise.prototype.finally';

import reducerRegistry from 'app/registry';
import routes from 'app/routes';
import makeStore from 'app/makeStore';

import MyGFWProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';

finallyShim.shim();

const getLocationFromParams = (url, params) => {
  if (url?.includes('[...location]')) {
    return {
      type: params?.location?.[0],
      adm0: params?.location?.[1],
      adm1: params?.location?.[2],
      adm2: params?.location?.[3],
    };
  }

  const location =
    params &&
    Object.keys(params).reduce((obj, key) => {
      if (url?.includes(`[${key}]`)) {
        return {
          ...obj,
          [key]: params[key],
        };
      }

      return obj;
    }, {});

  return location;
};

class MyApp extends App {
  store = makeStore();

  componentDidMount() {
    const { router } = this.props;

    this.handleRouteChange();

    router.events.on('routeChangeComplete', () => {
      this.handleRouteChange();
    });

    this.store.replaceReducer(combineReducers(reducerRegistry.getReducers()));
  }

  componentDidUpdate() {
    this.store.replaceReducer(combineReducers(reducerRegistry.getReducers()));
  }

  handleRouteChange = () => {
    const { router } = this.props;
    const { dispatch } = this.store;
    const { query, pathname } = router;
    const location = getLocationFromParams(pathname, query);
    dispatch({
      type: 'setLocation',
      payload: { ...location, ...(!isEmpty(query) && { query }) },
    });
  };

  render() {
    const { Component, pageProps, router } = this.props;
    const { route } = router || {};
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
