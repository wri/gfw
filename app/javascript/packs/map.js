/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import React from 'react';
import ReactDOM from 'react-dom';
import Map from 'pages/map';
import store from 'pages/map/store';
import { AppContainer } from 'react-hot-loader';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('map-page')
  );
};

document.addEventListener('DOMContentLoaded', () => render(Map));

if (module.hot) {
  /* eslint-disable global-require */
  module.hot.accept('pages/map/store', () => {
    const nextRootReducer = require('pages/map/store');
    store.replaceReducer(nextRootReducer.reducers);
  });
  module.hot.accept('pages/map', () => {
    render(require('pages/map').default);
  });
}
