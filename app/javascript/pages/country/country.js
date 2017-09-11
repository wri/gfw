import React from 'react';

import initialState from './initial-state';
import reducers from './reducers';
import store from '../../common/store';

const Country = () => {
  return (
    <Provider store={store(initialState, reducers)}>
      <div>
      </div>
    </Provider>
  );
};

export default Country;
