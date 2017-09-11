import React from 'react';
import { Provider } from 'react-redux';

import initialState from './initial-state';
import reducers from './reducers';
import store from '../../common/store';

import Map from './components/map/map';

const Country = () => {
  return (
    <Provider store={store(initialState, reducers)}>
      <div className="row">
        <div className="small-9 columns"></div>
        <div className="small-4 columns">
          <Map />
        </div>
      </div>
    </Provider>
  );
};

export default Country;
