import React from 'react';
import ReactDOM from 'react-dom';
import Map from 'map';
import { AppContainer } from 'react-hot-loader';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('react-map')
  );
};

document.addEventListener('DOMContentLoaded', () => render(Map));

if (module.hot) {
  /* eslint-disable global-require */
  module.hot.accept('../map', () => {
    render(require('../map').default);
  });
}
