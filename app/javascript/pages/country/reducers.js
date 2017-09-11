import { combineReducers } from 'redux'
import { handleActions } from '../../utils/redux';

import initialState from './initial-state';
import allActions from './actions';
import { reducers as mapReducers } from './components/map/map';

const reducers = combineReducers({
  map: handleActions('map', allActions, mapReducers, initialState),
});

export default reducers
