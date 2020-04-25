import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import finallyShim from 'promise.prototype.finally';
import reducerRegistry from 'app/registry';
import { combineReducers } from 'redux';
import Router from 'next/router'

import routes from 'app/routes';
import makeStore from 'lib/with-redux-store';

import MyGFWProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';

finallyShim.shim();

const getLocationFromParams = (url, params) => {
  if (url.includes('[...location]')) {
    return {
      type: params?.location?.[0],
      adm0: params?.location?.[1],
      adm1: params?.location?.[2],
      adm2: params?.location?.[3]
    }
  }

  const location = Object.keys(params).reduce((obj, key) => {
    if (url.includes(`[${key}]`)) {
      return {
        ...obj,
        [key]: params[key]
      }
    }

    return obj
  }, {})

  return location
}

class MyApp extends App {
  store = makeStore();

  componentDidMount() {
    this.handleRouteChange();

    Router.events.on('routeChangeComplete', () => {
      this.handleRouteChange();
    })

    this.store.replaceReducer(combineReducers(reducerRegistry.getReducers()));
  }

  componentDidUpdate() {
    this.store.replaceReducer(combineReducers(reducerRegistry.getReducers()));
  }

  handleRouteChange = () => {
    const { dispatch } = this.store;
    const location = getLocationFromParams(Router.router.pathname, Router.router.query);
    dispatch({ type: 'setLocation', payload: location });
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
