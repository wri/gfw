import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import createBrowserHistory from 'history/createBrowserHistory';

import initialState from './initial-state';
import reducers from './reducers';
import store from '../../common/store';
import routes from './routes';
const history = createBrowserHistory();

const Country = () => {
  return (
    <Provider store={store(initialState, reducers)}>
      <Router history={history}>
        {renderRoutes(routes)}
      </Router>
    </Provider>
  );
};

export default Country;
