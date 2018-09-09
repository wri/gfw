/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

import * as MyGFWProviderComponent from 'providers/mygfw-provider';

export default combineReducers({
  myGfw: handleActions(MyGFWProviderComponent)
});
