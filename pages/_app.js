/* eslint-disable react/prop-types */
import React from 'react';
import App from 'next/app';
import finallyShim from 'promise.prototype.finally';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import makeStore from 'app/store';

import reducerRegistry from 'app/registry';
import MyGFWProvider from 'providers/mygfw-provider';
import LocationProvider from 'providers/location-provider';

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
    const { Component, pageProps } = this.props;

    return (
      <Provider store={this.store}>
        <MyGFWProvider />
        <LocationProvider />
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;
