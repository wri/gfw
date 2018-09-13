/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';

import * as MyGFWProviderComponent from 'providers/mygfw-provider';

export default combineReducers({
  myGfw: handleModule(MyGFWProviderComponent)
});
