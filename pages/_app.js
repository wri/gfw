import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import isEmpty from 'lodash/isEmpty';

import finallyShim from 'promise.prototype.finally';

import { decodeParamsForState, encodeStateForUrl } from 'utils/stateToUrl';

import reducerRegistry from 'app/registry';
import makeStore from 'app/store';

import MyGFWProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';

finallyShim.shim();

const getLocationFromParams = (url, params) => {
  if (url?.includes('[...location]')) {
    const type = params?.location?.[0];
    const adm0 = params?.location?.[1];
    const adm1 = params?.location?.[2];
    const adm2 = params?.location?.[3];

    return {
      type,
      adm0: isNaN(adm0) ? adm0 : parseInt(adm0, 10),
      adm1: isNaN(adm1) ? adm1 : parseInt(adm1, 10),
      adm2: isNaN(adm2) ? adm2 : parseInt(adm2, 10),
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

  handleRouteChange = () => {
    const { router } = this.props;
    const { dispatch } = this.store;
    const { query, pathname } = router;
    const search = encodeStateForUrl(query);
    const decodedQuery = query && decodeParamsForState(query);
    const location =
      decodedQuery && getLocationFromParams(pathname, decodedQuery);

    dispatch({
      type: 'setLocation',
      payload: {
        pathname,
        payload: location,
        search,
        ...(!isEmpty(decodedQuery) && { query: decodedQuery }),
      },
    });
  };

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

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Provider store={this.store}>
        <MyGFWProvider />
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;
