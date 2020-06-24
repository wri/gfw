import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app';
import { AppContainer, setConfig } from 'react-hot-loader';
import * as Sentry from '@sentry/browser';

setConfig({
  pureSFC: true
});

Sentry.init({ dsn: process.env.SENTY_URL });

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app-root')
  );
};

document.addEventListener('DOMContentLoaded', () => render(App));

if (module.hot) {
  /* eslint-disable global-require */
  module.hot.accept(['../app'], () => {
    render(require('../app').default);
  });
}
