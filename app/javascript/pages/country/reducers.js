import { combineReducers } from 'redux'
import { handleActions } from '../../utils/redux';

import initialState from './initial-state';
import allActions from './actions';
import { reducers as rootReducers } from './components/root/root';
import { reducers as mapReducers } from './components/map/map';
import { reducers as widgetTreeCoverReducers } from './components/widget-tree-cover/widget-tree-cover';

const reducers = combineReducers({
  root: handleActions('root', allActions, rootReducers, initialState),
  map: handleActions('map', allActions, mapReducers, initialState),
  widgetTreeCover: handleActions('widgetTreeCover', allActions, widgetTreeCoverReducers, initialState)
});

export default reducers
