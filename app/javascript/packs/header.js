import React from 'react';
import ReactDOM from 'react-dom';
import Header from 'header';
import { AppContainer } from 'react-hot-loader';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('react-header')
  );
};

document.addEventListener('DOMContentLoaded', () => render(Header));

if (module.hot) {
  /* eslint-disable global-require */
  module.hot.accept('../app/components/header', () => {
    render(require('../app/components/header').default);
  });
}
